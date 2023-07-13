import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";

import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";

import { UsersService } from "../users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}
	// signup
	async signup(email: string, password: string) {
		// See if email is in use
		const users = await this.usersService.find(email);
		if (users.length) {
			throw new BadRequestException("email in use");
		}
		// Hash the users password and // Generate a salt
		const salt = randomBytes(8).toString("hex");
		// Hash the salt and the password together
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		// Join the hashed result and the salt together
		const hashedPassword = salt + "." + hash.toString("hex");
		// Create a new user and save it
		const user = await this.usersService.create(email, hashedPassword);
		// return the user
		return user;
	}
	// signin
	async signin(email: string, password: string) {
		const [user] = await this.usersService.find(email);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		// store password
		const [salt, storedHash] = user.password.split(".");
		// hash
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		// storedHash
		if (storedHash !== hash.toString("hex")) {
			throw new BadRequestException("bad password");
		}
		// return
		return user;
	}
}
