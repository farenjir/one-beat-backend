import { Controller, Body, Get, Put, Delete, Param, ParseIntPipe, Req, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UsersService } from "./users.service";
import { UserDto, UserIgnoredDto, UserProfileDto, UpdateProfileDto, UserProfileResponseDto, UserQuery } from "./user.dto";
import { usersSchema } from "./user.schema";

@ApiTags("Users")
@Controller("user")
@Serialize(UserIgnoredDto)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}
	// currentUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Get("whoAmI")
	@ResponseMessage("")
	async whoAmI(@Req() { user }: Request): Promise<UserDto> {
		return await this.usersService.findBy({ id: user?.id }, true);
	}
	// profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Get("profile")
	@ResponseMessage("")
	async findProfile(@Req() { user }: Request): Promise<UserProfileDto> {
		return await this.usersService.findUserWithProfile({ id: user?.id }, true);
	}
	// updateUser with profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Put("update")
	@ResponseMessage("2005")
	async updateUserWithProfileById(@Req() { user }: Request, @Body() body: UpdateProfileDto): Promise<UserDto> {
		return await this.usersService.updateUserProfile(user?.id, body);
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { response: ResEnum.ArrayWithCount, query: usersSchema })
	@AppGuards(Role.Admin, Role.Editor)
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async findAllUser(@Query() queryParams: UserQuery): Promise<[UserDto[], number]> {
		return await this.usersService.findUsers(queryParams);
	}
	// findUser
	@SwaggerDocumentaryApi(UserProfileDto, { query: usersSchema.slice(2, 5) })
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getUser")
	@ResponseMessage("")
	async findUserById(@Query() { username, id, email }: Pick<UserQuery, "id" | "email" | "username">): Promise<UserProfileDto> {
		return await this.usersService.findUserWithProfile({ username, id, email }, true);
	}
	// updateUser
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Put("updateBy/:id")
	@ResponseMessage("2005")
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UserProfileDto): Promise<UserProfileDto> {
		return await this.usersService.updateById(id, body);
	}
	// removeUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Delete("deleteBy/:id")
	@ResponseMessage("2006")
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<UserDto> {
		return await this.usersService.removeById(id);
	}
}
