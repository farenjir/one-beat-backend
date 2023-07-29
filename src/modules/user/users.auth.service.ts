import { NotFoundException, BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { randomBytes, scrypt } from "crypto";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "./user.service";
import { User } from "./user.entity";
import { TokenDto, UserDto } from "./user.dto";

async function hashPassword(password: string, salt: string): Promise<string> {
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
	constructor(private usersService: UsersService, private jwtService: JwtService) {}
	// generateToken
	async generateToken(user: User): Promise<string> {
		return this.jwtService.signAsync({ id: user.id, email: user.email, roles: user.roles });
	}
	// signup
	async signup(email: string, password: string): Promise<User> {
		const user = await this.usersService.findByEmail(email);
		if (user) {
			throw new BadRequestException("Email is already in use");
		}
		// hash with add salt
		const salt = randomBytes(8).toString("hex");
		const hash = await hashPassword(password, salt);
		// hashedPassword
		const hashedPassword = `${salt}.${hash}`;
		// return new user
		return await this.usersService.create(email, hashedPassword);
	}
	// signin
	async signin(email: string, password: string): Promise<UserDto & TokenDto> {
		const user = await this.usersService.findByEmail(email);
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
