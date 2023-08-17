import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppResponseDto, appResponse } from "utils/response.filter";
import { Serialize } from "utils/serialize.interceptor";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";

import { AppGuards, Role } from "guard/guard.decorator";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, IgnoredBaseDto } from "./base.dto";
import { ValidationQueryPipe } from "./bases.pipe";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
@Serialize(IgnoredBaseDto, false)
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { responseIsObject: false, useAuth: false })
	@Get("all")
	async getBases(): Promise<AppResponseDto<BaseDto>> {
		const bases: BaseDto[] = await this.typeService.findAllBases();
		return appResponse(bases);
	}
	// get one type
	@SwaggerDocumentaryApi(BaseDto, {
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
	@Get("getBase")
	async getBase(@Query(new ValidationQueryPipe()) query: BaseQuery = {}): Promise<AppResponseDto<BaseDto>> {
		const { baseId, baseType } = query;
		const base: BaseDto = await this.typeService.findBase(baseId, baseType);
		return appResponse(base);
	}
	// get children of type
	@SwaggerDocumentaryApi(BaseDto, {
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
	@SwaggerDocumentaryApi(BaseDto)
	@Post("addBase")
	// @AppGuards(Role.Admin)
	async addNewBase(@Body() body: CreateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const createdBase: BaseDto = await this.typeService.create(body);
		return appResponse(createdBase, "2007");
	}
	// update pre types
	@SwaggerDocumentaryApi(BaseDto)
	@Patch("updateBy/:id")
	// @AppGuards(Role.Admin)
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const updatedBase: BaseDto = await this.typeService.updateById(id, body);
		return appResponse(updatedBase, "2008");
	}
	// delete types
	@SwaggerDocumentaryApi(BaseDto)
	@Delete("deleteBy/:id")
	@AppGuards(Role.Admin)
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<BaseDto>> {
		const deletedBase: BaseDto = await this.typeService.removeById(id);
		Object.assign(deletedBase, { id });
		return appResponse(deletedBase, "2008");
	}
}
