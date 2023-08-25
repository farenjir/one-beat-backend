import { Controller, Body, Get, Patch, Delete, Param, ParseIntPipe, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { AppGuards, Role } from "guards/guards.decorator";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { Serialize } from "global/serialize.interceptor";

import { UserDto, UserIgnoredDto, UserProfileDto, UpdateProfileDto } from "./user.dto";
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
		const currentUser = await this.usersService.findBy({ id: userId }, true);
		return appResponse(currentUser, "2002");
	}
	// profile
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards()
	@Get("userProfile")
	async findProfile(@Req() req: Request): Promise<AppResponseDto<UserProfileDto>> {
		const userId = req.user.id;
		const userProfile = await this.usersService.findUserWithProfile({ id: userId }, true);
		return appResponse(userProfile);
	}
	// updateUser with profile
	@SwaggerDocumentaryApi(UpdateProfileDto)
	@AppGuards()
	@Patch("updateUser")
	async updateUserWithProfileById(@Req() req: Request, @Body() body: UpdateProfileDto): Promise<AppResponseDto<UserDto>> {
		const userId = req.user.id;
		const updatedUser = await this.usersService.updateUserProfile(userId, body);
		return appResponse(updatedUser, "2005");
	}
	// findAllUsers
	@SwaggerDocumentaryApi(UserDto, { responseIsObject: false })
	@AppGuards(Role.Admin)
	@Get("getUsers")
	async findAllUser(): Promise<AppResponseDto<UserDto>> {
		const users: UserDto[] = await this.usersService.findUsers();
		return appResponse(users);
	}
	// findUser
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards(Role.Admin, Role.User)
	@Get("getBy/:id")
	async findUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserProfileDto>> {
		const user: UserProfileDto = await this.usersService.findUserWithProfile({ id });
		return appResponse(user);
	}
	// updateUser
	@SwaggerDocumentaryApi(UserProfileDto)
	@AppGuards(Role.Admin)
	@Patch("updateBy/:id")
	async updateUserById(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: UserProfileDto,
	): Promise<AppResponseDto<UserProfileDto>> {
		const updatedUser = await this.usersService.updateById(id, body);
		return appResponse(updatedUser, "2005");
	}
	// removeUser
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	async removeUserById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<UserDto>> {
		const removedUser = await this.usersService.removeById(id);
		Object.assign(removedUser, { id });
		return appResponse(removedUser, "2006");
	}
}
