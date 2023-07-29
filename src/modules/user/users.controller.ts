import {
	Controller,
	Body,
	Post,
	Get,
	Patch,
	Delete,
	Query,
	ParseIntPipe,
	UseGuards,
	Res,
	Req,
} from "@nestjs/common";
import { Response, Request } from "express";

import { cookieOptions, globalKeys } from "utils/global.configs";
import { Serialize } from "utils/interceptors/serialize.interceptor";

import { Role } from "modules/role/role.enum";
import { Roles } from "modules/role/roles.decorator";
import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { CreateUserDto, UpdateUserDto, UserDto } from "./user.dto";
import { UsersService } from "./user.service";
import { AuthService } from "./users.auth.service";

@Controller("user")
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}
	// return current user
	@Get("")
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
		return await this.usersService.findById(id);
	}
	// findAllUsers
	@Get("getAll")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	findAllUser() {
		return this.usersService.findUsers();
	}
	// updateUser
	@Patch("updateById")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	updateUserById(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
		return this.usersService.updateById(id, body);
	}
	// removeUser
	@Delete("deleteById")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	removeUserById(@Query("id", ParseIntPipe) id: number) {
		return this.usersService.removeById(id);
	}
	// signin of auth services
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response) {
		const userExtended = await this.authService.signin(body.email, body.password);
		res.cookie(globalKeys.tokenKey, userExtended.token, cookieOptions);
		return userExtended;
	}
	// signOut
	@Post("signOut")
	@UseGuards(AuthGuard)
	signOut(@Res({ passthrough: true }) res: Response) {
		res.clearCookie(globalKeys.tokenKey);
	}
	// createUser
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto) {
		return await this.authService.signup(body.email, body.password);
	}
}