import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Serialize } from "utils/interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Roles } from "guards/role/roles.decorator";
import { Role } from "guards/role/role.enum";

import { CreateBaseDto, BaseDto, UpdateBaseDto } from "./base.dto";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@ApiOkResponse({ type: BaseDto })
	@Get("getAll")
	async getBases(): Promise<BaseDto[]> {
		return await this.typeService.findBases();
	}
	@ApiOkResponse({ type: BaseDto })
	@Get("getById")
	async getBaseById(@Query("id", ParseIntPipe) id: number): Promise<BaseDto> {
		return await this.typeService.findById(id);
	}
	// add new types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Post("addNew")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.typeService.create(body);
	}
	// update pre types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Patch("updateById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async updateBase(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<BaseDto> {
		return await this.typeService.updateById(id, body);
	}
	// delete types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Delete("deleteById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteBase(@Query("id", ParseIntPipe) id: number): Promise<BaseDto> {
		const typeRemoved = await this.typeService.removeById(id);
		return { id, ...typeRemoved };
	}
}
