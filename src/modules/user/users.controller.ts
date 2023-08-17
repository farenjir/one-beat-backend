import { Controller, Body, Post, Get, Patch, Delete, Param, ParseIntPipe, UseGuards, Res, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";

import { SwaggerDocumentary } from "app/app.decorator";
import { AppResponseDto, appResponse } from "app/response";
import { Serialize } from "app/serialize";

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
	@SwaggerDocumentary({ responseDto: UserDto, useAuth: false })
	@Post("signIn")
	async signIn(@Body() body: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<AppResponseDto<UserDto>> {
		const { token, cookieOptions, ...user }: UserDto & UserExtraDto = await this.authService.signin(
			body.email,
			body.password,
		);
		res.cookie("app-token", token, cookieOptions);
		return appResponse(user, "2002");
	}
	// signUp
	@SwaggerDocumentary({ responseDto: UserDto, useAuth: false })
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto): Promise<AppResponseDto<UserDto>> {
		const userCreated: UserDto = await this.authService.signup(body.email, body.password);
		return appResponse(userCreated, "2003");
	}
	// signOut
	@SwaggerDocumentary({ responseDto: UserDto })
	@Post("signOut")
	@UseGuards(AuthGuard)
	signOut(@Res({ passthrough: true }) res: Response, @Req() { user }: Request): AppResponseDto<any> {
		res.clearCookie("app-token");
		return appResponse(user, "2004");
	}
	// currentUser
	@SwaggerDocumentary({ responseDto: UserDto })
	@Get("whoAmI")
	@UseGuards(AuthGuard)
	async whoAmI(@Req() req: Request): Promise<AppResponseDto<UserDto>> {
		const userId = req.user.id;
		const currentUser: UserDto = await this.usersService.findBy(userId);
		return appResponse(currentUser, "2002");
	}
	// findAllUsers
	@SwaggerDocumentary({ responseDto: UserDto, responseIsObject: false })
	@Get("all")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findAllUser(): Promise<AppResponseDto<UserDto>> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@SwaggerDocumentary({ responseDto: UserDto })
	@Get("getBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const user: UserDto = await this.usersService.findBy(id);
		return appResponse(user);
	}
	// updateUser
	@SwaggerDocumentary({ responseDto: UserDto })
	@Patch("updateBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<AppResponseDto<UserDto>> {
		const updatedUser: UserDto = await this.usersService.updateById(id, body);
		return appResponse(updatedUser, "2005");
	}
	// removeUser
	@SwaggerDocumentary({ responseDto: UserDto })
	@Delete("deleteBy/:id")
	@Roles(Role.Admin, Role.User)
	@UseGuards(AuthGuard, RolesGuard)
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const removedUser: UserDto = await this.usersService.removeById(id);
		Object.assign(removedUser, { id });
		return appResponse(removedUser, "2006");
	}
}
