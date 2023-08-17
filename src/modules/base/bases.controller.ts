import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppResponseDto, appResponse } from "app/response";
import { Serialize } from "app/serialize";
import { SwaggerDocumentary } from "app/app.decorator";

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
	@SwaggerDocumentary(BaseDto, { responseIsObject: false, useAuth: false })
	@Get("all")
	async getBases(): Promise<AppResponseDto<BaseDto>> {
		const bases: BaseDto[] = await this.typeService.findAllBases();
		return appResponse(bases);
	}
	// get one type
	@SwaggerDocumentary(BaseDto, {
		useAuth: false,
		query: [
			{
				name: "baseType",
				required: false,
				type: String,
			},
			{
				name: "baseId",
				required: false,
				type: Number,
			},
		],
	})
	@Get("base")
	async getBase(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<AppResponseDto<BaseDto>> {
		const { baseId, baseType } = query;
		const base: BaseDto = await this.typeService.findBase(baseId, baseType);
		return appResponse(base);
	}
	// get children of type
	@SwaggerDocumentary(BaseDto, {
		responseIsObject: false,
		useAuth: false,
		query: [
			{
				name: "parentType",
				required: false,
				type: String,
			},
			{
				name: "parentId",
				required: false,
				type: Number,
			},
		],
	})
	@Get("children")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<AppResponseDto<BaseDto>> {
		const { parentId, parentType } = query;
		const children: BaseDto[] = await this.typeService.findBaseChildren(parentId, parentType);
		return appResponse(children);
	}
	// add new types
	@SwaggerDocumentary(BaseDto)
	@Post("addBase")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async addNewBase(@Body() body: CreateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const createdBase: BaseDto = await this.typeService.create(body);
		return appResponse(createdBase, "2007");
	}
	// update pre types
	@SwaggerDocumentary(BaseDto)
	@Patch("updateBy/:id")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const updatedBase: BaseDto = await this.typeService.updateById(id, body);
		return appResponse(updatedBase, "2008");
	}
	// delete types
	@SwaggerDocumentary(BaseDto)
	@Delete("deleteBy/:id")
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<BaseDto>> {
		const deletedBase: BaseDto = await this.typeService.removeById(id);
		Object.assign(deletedBase, { id });
		return appResponse(deletedBase, "2008");
	}
}
