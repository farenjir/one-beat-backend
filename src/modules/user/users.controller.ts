import { Controller, Body, Post, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, Res, Req } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";

import { IAppResponse, appResponse } from "app/app.response";
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
	constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}
	// auth services
	@ApiOkResponse({ type: UserDto })
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<IAppResponse> {
		const { token, cookieOptions, ...user }: UserDto & UserExtraDto = await this.authService.signin(
			body.email,
			body.password,
		);
		res.cookie("app-token", token, cookieOptions);
		return appResponse(user, "2002");
	}
	// signUp
	@ApiOkResponse({ type: UserDto })
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto): Promise<IAppResponse> {
		const userCreated: UserDto = await this.authService.signup(body.email, body.password);
		return appResponse(userCreated, "2003");
	}
	// signOut
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Post("signOut")
	@UseGuards(AuthGuard)
	signOut(@Res({ passthrough: true }) res: Response, @Req() req: Request): IAppResponse {
		res.clearCookie("app-token");
		return appResponse(req.user, "2004");
	}
	// currentUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Get("whoAmI")
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request): Promise<IAppResponse> {
		const userId = req.user.id;
		const currentUser: UserDto = await this.usersService.findBy(userId);
		return appResponse(currentUser, "2002");
	}
	// findAllUsers
	@ApiCookieAuth()
	@ApiOkResponse({ type: [UserDto] })
	@Get("getAll")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findAllUser(): Promise<IAppResponse> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Get("getBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<IAppResponse> {
		const user: UserDto = await this.usersService.findBy(id);
		return appResponse(user);
	}
	// updateUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Patch("updateBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<IAppResponse> {
		const updatedUser: UserDto = await this.usersService.updateById(id, body);
		return appResponse(updatedUser, "2005");
	}
	// removeUser
	@ApiCookieAuth()
	@ApiOkResponse({ type: UserDto })
	@Delete("deleteBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<IAppResponse> {
		const removedUser: UserDto = await this.usersService.removeById(id);
		Object.assign(removedUser, { id });
		return appResponse(removedUser, "2006");
	}
}
