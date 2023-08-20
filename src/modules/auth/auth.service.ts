import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { randomBytes, scrypt } from "crypto";

import { BaseService } from "modules/base/bases.service";

import { UserDto } from "modules/user/user.dto";
import { UsersService } from "modules/user/user.service";

import { AuthSignUpDto, AuthExtraDto, SignInDto } from "./auth.dto";

export const cookieOptions = {
	path: "/",
	maxAge: 24 * 24 * 3600,
	httpOnly: true,
	secure: true,
};

export async function hashPassword(password: string, salt: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		scrypt(password, salt, 32, (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex"));
			}
		});
	});
}

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private baseService: BaseService,
		private jwtService: JwtService,
		private config: ConfigService,
	) {}
	// generateToken
	async generateToken(user: UserDto): Promise<string> {
		return this.jwtService.signAsync({ id: user.id, roles: user.roles }, { secret: this.config.get<string>("JWT_KEY") });
	}
	// signup
	async signup(userParams: AuthSignUpDto): Promise<UserDto> {
		const { genderId, email, password, ...other } = userParams;
		const user = await this.usersService.findBy(null, email);
		if (user) {
			throw new BadRequestException("4002");
		}
		const gender = await this.baseService.findBase(genderId);
		// hash with add salt
		const salt = randomBytes(16).toString("hex");
		const hash = await hashPassword(password, salt);
		// hashedPassword
		const hashedPassword = `${salt}.${hash}`;
		// return new user
		return await this.usersService.create({ email, gender, password: hashedPassword });
	}
	// signin
	async signin(userParams: SignInDto): Promise<UserDto & AuthExtraDto> {
		const { email, password } = userParams;
		const user = await this.usersService.findBy(null, email);
		// stored password
		const [salt, storedHash] = user.password.split(".");
		const hash = await hashPassword(password, salt);
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
