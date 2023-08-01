import { Controller, Body, Post, Get, Patch, Delete, Query, ParseIntPipe, UseGuards, Res, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { cookieOptions } from "utils/global.configs";
import { Serialize } from "utils/interceptors/serialize.interceptor";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/roles.decorator";

import { RolesGuard } from "guards/role.guard";
import { AuthGuard } from "guards/auth.guard";

import { CreateUserDto, UpdateUserDto, UserDto } from "./user.dto";
import { UsersService } from "./user.service";
import { AuthService } from "./users.auth.service";

@ApiTags("User")
@Controller("user")
@Serialize(UserDto)
export class UsersController {
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}
	// auth services
	@ApiOkResponse({ type: UserDto })
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<UserDto> {
		const userExtended = await this.authService.signin(body.email, body.password);
		res.cookie("app-token", userExtended.token, cookieOptions);
		return userExtended;
	}
	// signOut
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Post("signOut")
	@UseGuards(AuthGuard)
	signOut(@Res({ passthrough: true }) res: Response, @Req() req: Request): UserDto {
		res.clearCookie("app-token");
		return req.user;
	}
	// createUser
	@ApiOkResponse({ type: UserDto })
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto): Promise<UserDto> {
		return await this.authService.signup(body.email, body.password);
	}
	// return current user
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Get("")
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request): Promise<UserDto> {
		const userId = req.user.id;
		return await this.usersService.findById(userId);
	}
	// findUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Get("getById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async findUserById(@Query("id", ParseIntPipe) id: number): Promise<UserDto> {
		return await this.usersService.findById(id);
	}
	// findAllUsers
	@ApiCookieAuth()
	@ApiOkResponse({ type: [UserDto] })
	@Get("getAll")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findAllUser(): Promise<UserDto[]> {
		return await this.usersService.findUsers();
	}
	// updateUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Patch("updateById")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async updateUserById(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<UserDto> {
		return await this.usersService.updateById(id, body);
	}
	// removeUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Delete("deleteById")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async removeUserById(@Query("id", ParseIntPipe) id: number): Promise<UserDto> {
		const userRemoved = await this.usersService.removeById(id);
		return { id, ...userRemoved };
	}
}
