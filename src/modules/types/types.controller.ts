import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Roles } from "guards/role/roles.decorator";
import { Role } from "guards/role/role.enum";

import { CreateTypeDto, TypeDto, UpdateTypeDto } from "./type.dto";
import { TypesService } from "./types.service";

@ApiTags("Type")
@Controller("type")
export class TypesController {
	constructor(private readonly typeService: TypesService) {}
	// get all types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Get("getAll")
	async getTypes(): Promise<TypeDto[]> {
		return await this.typeService.findTypes();
	}
	// add new types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Post("addNew")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async addNewType(@Body() body: CreateTypeDto): Promise<TypeDto> {
		return await this.typeService.create(body);
	}
	// update pre types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Patch("updateById")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateType(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateTypeDto): Promise<TypeDto> {
		return await this.typeService.updateById(id, body);
	}
	// delete types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Delete("deleteById")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async deleteType(@Query("id", ParseIntPipe) id: number): Promise<TypeDto> {
		const typeRemoved = await this.typeService.removeById(id);
		return { id, ...typeRemoved };
	}
}
