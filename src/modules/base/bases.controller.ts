import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiTags, ApiQuery } from "@nestjs/swagger";

import { ApiSwaggerResponse, AppResponseDto, appResponse } from "app/app.response";
import { Serialize } from "app/app.serialize";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/role.decorator";
import { RolesGuard } from "guards/role.guard";
import { AuthGuard } from "guards/auth.guard";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, IgnoredBaseDto } from "./base.dto";
import { ValidationQueryPipe } from "./bases.pipe";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
@Serialize(IgnoredBaseDto, false)
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@ApiSwaggerResponse(BaseDto, false, false)
	@Get("getAll")
	async getBases(): Promise<AppResponseDto> {
		const bases: BaseDto[] = await this.typeService.findAllBases();
		return appResponse(bases);
	}
	// get one type
	@ApiQuery({
		name: "baseType",
		required: false,
		type: String,
	})
	@ApiQuery({
		name: "baseId",
		required: false,
		type: Number,
	})
	@ApiSwaggerResponse(BaseDto, true, false)
	@Get("getBase")
	async getBase(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<AppResponseDto> {
		const { baseId, baseType } = query;
		const base: BaseDto = await this.typeService.findBase(baseId, baseType);
		return appResponse(base);
	}
	// get children of type
	@ApiQuery({
		name: "parentType",
		required: false,
		type: String,
	})
	@ApiQuery({
		name: "parentId",
		required: false,
		type: Number,
	})
	@ApiSwaggerResponse(BaseDto, false, false)
	@Get("getChildren")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<AppResponseDto> {
		const { parentId, parentType } = query;
		const children: BaseDto[] = await this.typeService.findBaseChildren(parentId, parentType);
		return appResponse(children);
	}
	// add new types
	@ApiCookieAuth()
	@ApiSwaggerResponse(BaseDto)
	@Post("addNewBase")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async addNewBase(@Body() body: CreateBaseDto): Promise<AppResponseDto> {
		const createdBase: BaseDto = await this.typeService.create(body);
		return appResponse(createdBase, "2007");
	}
	// update pre types
	@ApiCookieAuth()
	@ApiSwaggerResponse(BaseDto)
	@Patch("updateBy/:id")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<AppResponseDto> {
		const updatedBase: BaseDto = await this.typeService.updateById(id, body);
		return appResponse(updatedBase, "2008");
	}
	// delete types
	@ApiCookieAuth()
	@ApiSwaggerResponse(BaseDto)
	@Delete("deleteBy/:id")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto> {
		const deletedBase: BaseDto = await this.typeService.removeById(id);
		Object.assign(deletedBase, { id });
		return appResponse(deletedBase, "2008");
	}
}
