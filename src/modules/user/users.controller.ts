import { Controller, Body, Post, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, Res, Req } from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";

import { ApiSwaggerResponse, AppResponseDto, appResponse } from "app/app.response";
import { Serialize } from "app/app.serialize";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/role.decorator";
import { RolesGuard } from "guards/role.guard";
import { AuthGuard } from "guards/auth.guard";

import { CreateUserDto, UpdateUserDto, UserDto, UserExtraDto } from "./user.dto";
import { UsersService } from "./user.service";
import { AuthService } from "./users.auth.service";

@ApiTags("Users")
@Controller("user")
@Serialize(UserDto)
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}
	// auth services
	@ApiSwaggerResponse(UserDto, true, false)
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<AppResponseDto> {
		const { token, cookieOptions, ...user }: UserDto & UserExtraDto = await this.authService.signin(
			body.email,
			body.password,
		);
		res.cookie("app-token", token, cookieOptions);
		return appResponse(user, "2002");
	}
	// signUp
	@ApiSwaggerResponse(UserDto, true, false)
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto): Promise<AppResponseDto> {
		const userCreated: UserDto = await this.authService.signup(body.email, body.password);
		return appResponse(userCreated, "2003");
	}
	// signOut
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto)
	@Post("signOut")
	@UseGuards(AuthGuard)
	async signOut(@Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<AppResponseDto> {
		res.clearCookie("app-token");
		return appResponse(req.user, "2004");
	}
	// currentUser
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto)
	@Get("whoAmI")
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request): Promise<AppResponseDto> {
		const userId = req.user.id;
		const currentUser: UserDto = await this.usersService.findBy(userId);
		return appResponse(currentUser, "2002");
	}
	// findAllUsers
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto, false)
	@Get("getAll")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findAllUser(): Promise<AppResponseDto> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto)
	@Get("getBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto> {
		const user: UserDto = await this.usersService.findBy(id);
		return appResponse(user);
	}
	// updateUser
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto)
	@Patch("updateBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<AppResponseDto> {
		const updatedUser: UserDto = await this.usersService.updateById(id, body);
		return appResponse(updatedUser, "2005");
	}
	// removeUser
	@ApiCookieAuth()
	@ApiSwaggerResponse(UserDto)
	@Delete("deleteBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto> {
		const removedUser: UserDto = await this.usersService.removeById(id);
		Object.assign(removedUser, { id });
		return appResponse(removedUser, "2006");
	}
}
