import {
	Body,
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Query,
	UseGuards,
	ParseIntPipe,
	NotFoundException,
	Res,
	Req,
} from "@nestjs/common";
import { Response, Request } from "express";

import { Role } from "modules/role/role.enum";
import { Roles } from "modules/role/roles.decorator";

import { Serialize } from "utils/interceptors/serialize.interceptor";
import { AuthGuard } from "guards/auth.guard";

import { UsersService } from "./user.service";
import { AuthService } from "./users.auth.service";
import { CreateUserDto, UpdateUserDto, UserDto } from "./user.dto";
import { RolesGuard } from "guards/role.guard";

@Controller("user")
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}
	// return current user
	@Get()
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request) {
		const userId = req.user.id;
		return await this.usersService.findById(userId);
	}
	// findUser
	@Get("getById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async findUserById(@Query("id", ParseIntPipe) id: number) {
		const user = await this.usersService.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return user;
	}
	// findAllUsers
	@Get("getAll")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	findAllUser() {
		return this.usersService.findUsers();
	}
	// updateUser
	@Patch("updateById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	updateUserById(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
		return this.usersService.updateById(id, body);
	}
	// removeUser
	@Delete("deleteById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	removeUserById(@Query("id", ParseIntPipe) id: number) {
		return this.usersService.removeById(id);
	}
	// signin of auth services
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response) {
		const userWithToken = await this.authService.signin(body.email, body.password);
		res.cookie("app-token", userWithToken.token, {
			path: "/",
			httpOnly: true,
			maxAge: 24 * 24 * 3600,
			secure: process.env.NODE_ENV === "production",
		});
		return userWithToken;
	}
	// signOut
	@Post("signOut")
	signOut(@Res({ passthrough: true }) res: Response) {
		res.cookie("app-token", "");
	}
	// createUser
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto) {
		return await this.authService.signup(body.email, body.password);
	}
}
