import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { pickBy as _pickBy } from "lodash";

import { JwtService } from "@nestjs/jwt";
import { MailService } from "modules/mail/mail.service";

import { UserDto } from "modules/user/user.dto";
import { UsersService } from "modules/user/user.service";

import { AuthSignUpDto, AuthExtraDto, SignInDto } from "./auth.dto";
import { hashPassword, cookieOptions, handleHashPassword } from "./auth.configs";

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
		await this.sendConfirmMail(userCreated);
		// return new user
		return userCreated;
	}
	// signin
	async signin(userParams: SignInDto): Promise<UserDto & AuthExtraDto> {
		const { username, email, password } = userParams;
		const params = _pickBy<object>({ username, email }, (isTruthy: any) => isTruthy);
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
			throw new BadRequestException("4011");
		}
		// return JWT token
		return {
			cookieOptions,
			token: await this.generateToken(user),
			...user,
		};
	}
	async confirmUserEmail(token: string): Promise<UserDto> {
		const { id } = await this.decodeToken(token);
		// confirmEmail
		return await this.usersService.updateById(id, {
			kyc: {
				emailKyc: true,
				userKyc: true,
			},
		});
	}
	// handles
	async generateToken({ roles, id }: UserDto): Promise<string> {
		return this.jwtService.signAsync({ id, roles }, { secret: this.config.get<string>("JWT_KEY") });
	}
	async sendConfirmMail(user: UserDto): Promise<void> {
		const token = await this.generateToken(user);
		await this.mailService.sendUserConfirmation(user, token);
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
