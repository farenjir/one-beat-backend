import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { UserDto } from "modules/user/user.dto";
import { UsersService } from "modules/user/user.service";

import { AuthSignUpDto, AuthExtraDto, SignInDto } from "./auth.dto";
import { hashPassword, cookieOptions, handleHashPassword } from "./auth.configs";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		private config: ConfigService,
	) {}
	// generateToken
	async generateToken(user: UserDto): Promise<string> {
		return this.jwtService.signAsync({ id: user.id, roles: user.roles }, { secret: this.config.get<string>("JWT_KEY") });
	}
	// signup
	async signup(userParams: AuthSignUpDto): Promise<UserDto> {
		const { email, password, ...other } = userParams;
		const user = await this.usersService.findBy(null, email);
		if (user) {
			throw new BadRequestException("4002");
		}
		// hashedPassword
		const hashedPassword = await hashPassword(password);
		// return new user
		return await this.usersService.create({ ...other, email, password: hashedPassword });
	}
	// signin
	async signin(userParams: SignInDto): Promise<UserDto & AuthExtraDto> {
		const { email, password } = userParams;
		const user = await this.usersService.findBy(null, email);
		// stored password
		const [salt, storedHash] = user.password.split(".");
		const hash = await handleHashPassword(password, salt);
		// check password
		if (storedHash !== hash) {
			throw new UnauthorizedException("4003");
		}
		// return JWT token
		return {
			cookieOptions,
			token: await this.generateToken(user),
			...user,
		};
	}
}
