import { Controller, Body, Get, Put, Delete, Param, ParseIntPipe, Req, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UsersService } from "./users.service";
import { UserDto, UserIgnoredDto, UserProfileDto, UpdateProfileDto, UserProfileResponseDto } from "./user.dto";
import { usersPaginationSchema } from "./user.schema";

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
	@SwaggerDocumentaryApi(UserDto, { response: ResEnum.ArrayWithCount, query: usersPaginationSchema })
	@AppGuards(Role.Admin)
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async findAllUser(@Query() queryParams: Pick<UserDto, "page" | "take">): Promise<[UserDto[], number]> {
		return await this.usersService.findUsers(queryParams);
	}
	// findUser
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards(Role.Admin, Role.User)
	@Get("getBy/:id")
	@ResponseMessage("")
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<UserProfileDto> {
		return await this.usersService.findUserWithProfile({ id }, true);
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
