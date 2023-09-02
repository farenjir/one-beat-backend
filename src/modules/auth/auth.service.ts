import { BadRequestException, Injectable, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { OAuth2Client } from "google-auth-library";
import { pickBy as _pickBy } from "lodash";

import { JwtService } from "@nestjs/jwt";
import { MailService } from "modules/mail/mail.service";

import { UserDto } from "modules/user/user.dto";
import { UsersService } from "modules/user/user.service";

import { AuthSignUpDto, AuthExtraDto, SignInDto } from "./auth.dto";
import { hashPassword, handleHashPassword } from "./auth.configs";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private mailService: MailService,
		private config: ConfigService,
	) {}
	// signup
	async signup(userParams: AuthSignUpDto): Promise<UserDto> {
		const { email, password, username } = userParams;
		// validation unique params
		const emailInUse = await this.usersService.findBy({ email });
		if (emailInUse) {
			throw new BadRequestException("4002");
		}
		const usernameInUse = await this.usersService.findBy({ username });
		if (usernameInUse) {
			throw new BadRequestException("4002");
		}
		// hashedPassword
		const hashedPassword = await hashPassword(password);
		// create user
		const userCreated = await this.usersService.create({ username, email, password: hashedPassword });
		// send confirmation mail
		const token = await this.generateToken(userCreated);
		await this.mailService.sendUserConfirmation(userCreated, token);
		// return new user
		return userCreated;
	}
	// signin
	async signin(userParams: SignInDto): Promise<UserDto & AuthExtraDto> {
		const { username, email, password } = userParams;
		const params = _pickBy<object>({ username, email }, (isTruthy: unknown) => isTruthy);
		// get
		const user = await this.usersService.findBy(params, true);
		// stored password
		const [salt, storedHash] = user.password.split(".");
		const hash = await handleHashPassword(password, salt);
		// check password
		if (storedHash !== hash) {
			throw new UnauthorizedException("4003");
		}
		// check activated
		if (!user.kyc.userKyc) {
			throw new ForbiddenException("4011");
		}
		// return JWT token
		return {
			token: await this.generateToken(user),
			...user,
		};
	}
	async authWithGoogle(token: string): Promise<UserDto & AuthExtraDto> {
		const clientId = this.config.get<string>("GOOGLE_AUTH_CLIENT_ID");
		// const clientSecret = this.config.get<string>("GOOGLE_AUTH_CLIENT_SECRET");
		const client = new OAuth2Client(clientId); // clientId , clientSecret , redirectUri
		let googleUser;
		try {
			// ticket
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: clientId,
			});
			googleUser = ticket.getPayload();
		} catch (error) {
			throw new ForbiddenException(error);
		}
		if (!googleUser?.email) {
			throw new UnauthorizedException();
		}
		// user auth with google
		let user = await this.usersService.findBy({ email: googleUser.email });
		if (!user) {
			user = await this.usersService.create(
				{
					email: googleUser.email,
					username: googleUser.name,
					password: googleUser.name,
					isRegisteredWithGoogle: true,
				},
				true, // isRegistered with google
			);
		}
		// return JWT token
		return {
			token: await this.generateToken(user),
			...user,
		};
	}
	async confirmUserEmail(token: string): Promise<UserDto> {
		const { id } = await this.decodeToken(token);
		// update kyc
		return await this.usersService.updateById(id, {
			kyc: {
				emailKyc: true,
				userKyc: true,
			},
		});
	}
	async forgetPassword({ email, username }: Partial<UserDto>): Promise<UserDto> {
		const params = _pickBy<object>({ username, email }, (isTruthy: unknown) => isTruthy);
		const user = await this.usersService.findBy(params, true);
		// send new password
		const token = await this.generateToken(user);
		await this.mailService.sendUserPassword(user, token);
		// return new user
		return user;
	}
	async recoverPassword(token: string): Promise<UserDto> {
		const { id } = await this.decodeToken(token);
		// update password
		return await this.usersService.updateById(id, {
			password: "P@ssword123", // change password to default
		});
	}
	// handles
	async generateToken({ roles, id }: UserDto): Promise<string> {
		return this.jwtService.signAsync({ id, roles }, { secret: this.config.get<string>("JWT_KEY") });
	}
	async decodeToken(token: string): Promise<Partial<UserDto>> {
		let user: Partial<UserDto>;
		try {
			user = await this.jwtService.verifyAsync(token, {
				secret: this.config.get<string>("JWT_KEY"),
			});
		} catch (error) {
			user = { id: 0 };
		}
		return user;
	}
}
