import { Controller, Body, Get, Patch, Delete, Param, ParseIntPipe, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "guards/guards.decorator";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { Serialize } from "utils/serialize.interceptor";

import { UpdateUserDto, UserDto, UserIgnoredDto } from "./user.dto";
import { UsersService } from "./user.service";

@ApiTags("Users")
@Controller("user")
@Serialize(UserIgnoredDto, false)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	// currentUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Get("whoAmI")
	async whoAmI(@Req() req: Request): Promise<AppResponseDto<UserDto>> {
		const userId = req.user.id;
		const currentUser: UserDto = await this.usersService.findBy({ id: userId });
		return appResponse(currentUser, "2002");
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { responseIsObject: false })
	@AppGuards(Role.Admin, Role.User)
	@Get("getAll")
	async findAllUser(): Promise<AppResponseDto<UserDto>> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.User)
	@Get("getBy/:id")
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const user: UserDto = await this.usersService.findBy({ id });
		return appResponse(user);
	}
	// updateUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.User)
	@Patch("updateBy/:id")
	async updateUserById(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: UpdateUserDto,
	): Promise<AppResponseDto<UserDto>> {
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
