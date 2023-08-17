import { Controller, Body, Post, Get, Patch, Delete, Param, ParseIntPipe, Res, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";

import { AppGuards, Role } from "guard/guard.decorator";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { Serialize } from "utils/serialize.interceptor";

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
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
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
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("signUp")
	async createUser(@Body() body: CreateUserDto): Promise<AppResponseDto<UserDto>> {
		const userCreated: UserDto = await this.authService.signup(body.email, body.password);
		return appResponse(userCreated, "2003");
	}
	// signOut
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Post("signOut")
	signOut(@Res({ passthrough: true }) res: Response, @Req() { user }: Request): AppResponseDto<any> {
		res.clearCookie("app-token");
		return appResponse(user, "2004");
	}
	// currentUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Get("whoAmI")
	async whoAmI(@Req() req: Request): Promise<AppResponseDto<UserDto>> {
		const userId = req.user.id;
		const currentUser: UserDto = await this.usersService.findBy(userId);
		return appResponse(currentUser, "2002");
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { responseIsObject: false })
	@AppGuards(Role.Admin, Role.User)
	@Get("all")
	async findAllUser(): Promise<AppResponseDto<UserDto>> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.User)
	@Get("getBy/:id")
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const user: UserDto = await this.usersService.findBy(id);
		return appResponse(user);
	}
	// updateUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.User)
	@Patch("updateBy/:id")
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<AppResponseDto<UserDto>> {
		const updatedUser: UserDto = await this.usersService.updateById(id, body);
		return appResponse(updatedUser, "2005");
	}
	// removeUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.User)
	@Delete("deleteBy/:id")
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const removedUser: UserDto = await this.usersService.removeById(id);
		Object.assign(removedUser, { id });
		return appResponse(removedUser, "2006");
	}
}
