import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Query,
	Session,
	UseGuards,
	ParseIntPipe,
	NotFoundException,
} from "@nestjs/common";

import { Serialize } from "utils/interceptors/serialize.interceptor";
import { AuthGuard } from "guards/auth.guard";

import { User } from "./user.entity";
import { CreateUserDto, UpdateUserDto, UserDto } from "./user.dto";
import { CurrentUser } from "./users.decorator";
import { UsersService } from "./user.service";
import { AuthService } from "./users.auth.service";

@Controller("user")
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}
	// return current user
	@Get()
	@UseGuards(AuthGuard)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}
	// findUser
	@Get("getById")
	@UseGuards(AuthGuard)
	async findUserById(@Query("id", ParseIntPipe) id: number) {
		const user = await this.usersService.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return user;
	}
	// findAllUsers
	@Get("getAll")
	@UseGuards(AuthGuard)
	findAllUser() {
		return this.usersService.findUsers();
	}
	// signOut
	@Post("signOut")
	signOut(@Session() session: any) {
		session.userId = null;
	}
	// createUser
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id;
		return user;
	}
	// signin
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Session() session: any) {
		const userWithToken = await this.authService.signin(body.email, body.password);
		console.log(userWithToken);
		session.userId = userWithToken.id;
		return userWithToken;
	}
	// updateUser
	@Patch("updateById")
	@UseGuards(AuthGuard)
	updateUserById(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
		return this.usersService.updateById(id, body);
	}
	// removeUser
	@Delete("deleteById")
	@UseGuards(AuthGuard)
	removeUserById(@Query("id", ParseIntPipe) id: number) {
		return this.usersService.removeById(id);
	}
}
