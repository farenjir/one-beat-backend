import { Controller, Delete, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Roles } from "modules/role/roles.decorator";
import { Role } from "modules/role/role.enum";

import { TypeDto } from "./type.dto";
import { TypesService } from "./types.service";

@ApiTags("type")
@Controller("type")
export class TypesController {
	constructor(private readonly typeService: TypesService) {}
	// get all types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Get("")
	async getTypes(): Promise<TypeDto> {
		return;
	}
	// add new types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Post("addNew")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async addNewType(): Promise<TypeDto> {
		return;
	}
	// update pre types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Patch("updateById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async updateType(): Promise<TypeDto> {
		return;
	}
	// delete types
	@ApiCookieAuth()
	@ApiOkResponse({ type: TypeDto })
	@Delete("deleteById")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteType(): Promise<TypeDto> {
		return;
	}
}
