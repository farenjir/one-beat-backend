import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags, ApiQuery } from "@nestjs/swagger";

import { IAppResponse, appResponse } from "utils/response.handle";
import { Serialize } from "utils/interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/role.decorator";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, IgnoredBaseDto } from "./base.dto";
import { ValidationQueryPipe } from "./base.pipe";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
@Serialize(IgnoredBaseDto, false)
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@ApiOkResponse({ type: BaseDto })
	@Get("getAll")
	async getBases(): Promise<IAppResponse> {
		const bases: BaseDto[] = await this.typeService.findAllBases();
		return appResponse(bases);
	}
	// get one type
	@ApiOkResponse({ type: BaseDto })
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
	@Get("getBase")
	async getBase(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<IAppResponse> {
		const { baseId, baseType } = query;
		const base: BaseDto = await this.typeService.findBase(baseId, baseType);
		return appResponse(base);
	}
	// get children of type
	@ApiOkResponse({ type: [BaseDto] })
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
	@Get("getChildren")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<IAppResponse> {
		const { parentId, parentType } = query;
		const children: BaseDto[] = await this.typeService.findBaseChildren(parentId, parentType);
		return appResponse(children);
	}
	// add new types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Post("addNewBase")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async addNewBase(@Body() body: CreateBaseDto): Promise<IAppResponse> {
		const createdBase: BaseDto = await this.typeService.create(body);
		return appResponse(createdBase, 2007);
	}
	// update pre types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Patch("updateBy/:id")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<IAppResponse> {
		const updatedBase: BaseDto = await this.typeService.updateById(id, body);
		return appResponse(updatedBase, 2008);
	}
	// delete types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Delete("deleteBy/:id")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<IAppResponse> {
		const deletedBase: BaseDto = await this.typeService.removeById(id);
		return appResponse(Object.assign(deletedBase, { id }), 2008);
	}
}
