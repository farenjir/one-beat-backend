import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "guards/guards.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, CreateBasesDto } from "./base.dto";
import { ValidationQueryPipe } from "./bases.pipe";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { responseIsObject: false, useAuth: false })
	@Get("getAll")
	async getBases(): Promise<AppResponseDto<BaseDto>> {
		const bases: BaseDto[] = await this.typeService.findAllBases();
		return appResponse(bases);
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
		const base = await this.typeService.findBase(baseId, baseType);
		return appResponse(base);
	}
	// add new types
	@SwaggerDocumentaryApi(CreateBaseDto)
	// @AppGuards(Role.Admin)
	@Post("addBase")
	async addNewBase(@Body() body: CreateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const createdBase = await this.typeService.create(body);
		return appResponse(createdBase, "2007");
	}
	@SwaggerDocumentaryApi(CreateBasesDto)
	// @AppGuards(Role.Admin)
	@Post("addBase/withChildren")
	async addNewBaseWithChildren(@Body() body: CreateBasesDto): Promise<AppResponseDto<BaseDto>> {
		const createdBase = await this.typeService.createWithChildren(body);
		return appResponse(createdBase, "2007");
	}
	// update pre types
	@SwaggerDocumentaryApi(BaseDto)
	// @AppGuards(Role.Admin)
	@Patch("updateBy/:id")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<AppResponseDto<BaseDto>> {
		const updatedBase = await this.typeService.updateById(id, body);
		return appResponse(updatedBase, "2008");
	}
	// delete types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<BaseDto>> {
		const deletedBase = await this.typeService.removeById(id);
		Object.assign(deletedBase, { id });
		return appResponse(deletedBase, "2008");
	}
}
