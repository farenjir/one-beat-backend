import { Controller, Body, Get, Put, Delete, Param, ParseIntPipe, Req, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UsersService } from "./users.service";
import { UserDto, UserIgnoredDto, UserProfileDto, UpdateProfileDto, UserProfileResponseDto, ProducerDto } from "./user.dto";
import { UserQuery, UsersQuery, ProducerQuery, ProducerIgnoredKycDto } from "./user.dto";

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
		return await this.usersService.findOne({ id: user?.id }, true);
	}
	// profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Get("profile")
	@ResponseMessage("")
	async findProfile(@Req() { user }: Request): Promise<UserProfileDto> {
		return await this.usersService.findOne({ id: user?.id }, true, true);
	}
	// updateUser with profile
	@SwaggerDocumentaryApi(UserProfileResponseDto)
	@AppGuards()
	@Put("update")
	@ResponseMessage("2005")
	async updateUserWithProfileById(@Req() { user }: Request, @Body() body: UpdateProfileDto): Promise<UserDto> {
		return await this.usersService.updateUserProfile(user?.id, body);
	}
	// findUser
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getUser")
	@ResponseMessage("")
	async findUserById(@Query() queryParams: UserQuery): Promise<UserProfileDto> {
		return await this.usersService.findOne(queryParams, true, true);
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { response: ResEnum.ArrayWithCount })
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getUsers")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async findAllUser(@Query() queryParams: UsersQuery): Promise<[UserDto[], number]> {
		return await this.usersService.findUsers(queryParams);
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
	// *** producers
	@Serialize(ProducerIgnoredKycDto)
	@SwaggerDocumentaryApi(ProducerDto, { response: ResEnum.ArrayWithCount, useAuth: false })
	@Get("producers")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async findTopProducers(@Query() queryParams: ProducerQuery): Promise<[ProducerDto[], number]> {
		const query = { ...queryParams, userKyc: true, role: Role.Admin };
		return await this.usersService.findUsers(query);
	}
}
