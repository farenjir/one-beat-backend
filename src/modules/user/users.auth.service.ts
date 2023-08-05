import { NotFoundException, BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { randomBytes, scrypt } from "crypto";

import { UsersService } from "./user.service";
import { Users } from "./user.entity";
import { UserTokenDto, UserDto } from "./user.dto";

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
			{ id: user.id, email: user.email, roles: user.roles },
			{ secret: this.config.get<string>("JWT_KEY") },
		);
	}
	// signup
	async signup(email: string, password: string): Promise<Users> {
		const validationEmail = email.toLowerCase();
		const user = await this.usersService.findByEmail(validationEmail);
		if (user) {
			throw new BadRequestException("Email is already in use");
		}
		// hash with add salt
		const salt = randomBytes(8).toString("hex");
		const hash = await hashPassword(password, salt);
		// hashedPassword
		const hashedPassword = `${salt}.${hash}`;
		// return new user
		return await this.usersService.create(validationEmail, hashedPassword);
	}
	// signin
	async signin(email: string, password: string): Promise<UserDto & UserTokenDto> {
		const validationEmail = email.toLowerCase();
		const user = await this.usersService.findByEmail(validationEmail);
		if (!user) {
			throw new NotFoundException("User not found");
		}
		// stored password
		const [salt, storedHash] = user.password.split(".");
		const hash = await hashPassword(password, salt);
		// check password
		if (storedHash !== hash) {
			throw new UnauthorizedException("Invalid password Or Email");
		}
		// return JWT token
		return {
			token: await this.generateToken(user),
			...user,
		};
	}
}
