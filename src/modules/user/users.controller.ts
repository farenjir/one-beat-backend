import { Controller, Body, Get, Put, Delete, Param, ParseIntPipe, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UsersService } from "./user.service";
import { UserDto, UserIgnoredDto, UserProfileDto, UpdateProfileDto, UserProfileResponseDto } from "./user.dto";

@ApiTags("Users")
@Controller("user")
@Serialize(UserIgnoredDto)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	// currentUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Get("whoAmI")
	@ResponseMessage("2002")
	async whoAmI(@Req() { user }: Request): Promise<UserDto> {
		return await this.usersService.findBy({ id: user?.id }, true);
	}
	// profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Get("getUser")
	@ResponseMessage("")
	async findProfile(@Req() { user }: Request): Promise<UserProfileDto> {
		return await this.usersService.findUserWithProfile({ id: user?.id }, true);
	}
	// updateUser with profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Put("updateUser")
	@ResponseMessage("2005")
	async updateUserWithProfileById(@Req() { user }: Request, @Body() body: UpdateProfileDto): Promise<UserDto> {
		return await this.usersService.updateUserProfile(user?.id, body);
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { responseIsObject: false })
	@AppGuards(Role.Admin)
	@Get("getUsers")
	@ResponseMessage("")
	async findAllUser(): Promise<UserDto[]> {
		return await this.usersService.findUsers();
	}
	// findUser
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards(Role.Admin, Role.User)
	@Get("getBy/:id")
	@ResponseMessage("")
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<UserProfileDto> {
		return await this.usersService.findUserWithProfile({ id });
	}
	// updateUser
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards(Role.Admin, Role.User)
	@Put("updateBy/:id")
	@ResponseMessage("2005")
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UserProfileDto): Promise<UserProfileDto> {
		return await this.usersService.updateById(id, body);
	}
	// removeUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	@ResponseMessage("2006")
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
		return await this.usersService.removeById(id);
	}
}
