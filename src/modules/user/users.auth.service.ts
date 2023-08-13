import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { randomBytes, scrypt } from "crypto";

import { UserExtraDto, UserDto } from "./user.dto";
import { UsersService } from "./user.service";
import { Users } from "./user.entity";

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
	constructor(private usersService: UsersService, private jwtService: JwtService, private config: ConfigService) {}
	// generateToken
	async generateToken(user: Users): Promise<string> {
		return this.jwtService.signAsync(
			{ id: user.id, roles: user.roles },
			{ secret: this.config.get<string>("JWT_KEY") },
		);
	}
	// signup
	async signup(email: string, password: string): Promise<Users> {
		const validationEmail = email.toLowerCase();
		const user = await this.usersService.findBy(null, validationEmail);
		if (user) {
			throw new BadRequestException("4002");
		}
		// hash with add salt
		const salt = randomBytes(16).toString("hex");
		const hash = await hashPassword(password, salt);
		// hashedPassword
		const hashedPassword = `${salt}.${hash}`;
		// return new user
		return await this.usersService.create(validationEmail, hashedPassword);
	}
	// signin
	async signin(email: string, password: string): Promise<UserDto & UserExtraDto> {
		const validationEmail = email.toLowerCase();
		const user = await this.usersService.findBy(null, validationEmail);
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
