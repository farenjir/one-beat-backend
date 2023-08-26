import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, CreateBasesDto } from "./base.dto";
import { ValidationQueryPipe } from "./bases.pipe";
import { BaseService } from "./bases.service";
import { AppResponse } from "global/response.decorator";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { responseIsObject: false, useAuth: false })
	@Get("getAll")
	@AppResponse("")
	async getBases(): Promise<BaseDto[]> {
		return await this.typeService.findAllBases();
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
	@AppResponse("")
	async getChildrenOfParent(
		@Query(new ValidationQueryPipe()) { parentId, parentType }: BaseQuery = {},
	): Promise<BaseDto[]> {
		return await this.typeService.findBaseChildren(parentId, parentType);
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
	@AppResponse("")
	async getBase(@Query(new ValidationQueryPipe()) { baseId, baseType }: BaseQuery = {}): Promise<BaseDto> {
		return await this.typeService.findBase(baseId, baseType);
	}
	// add new types
	@SwaggerDocumentaryApi(CreateBaseDto)
	@AppGuards(Role.Admin)
	@Post("addBase")
	@AppResponse("2007")
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.typeService.create(body);
	}
	@SwaggerDocumentaryApi(CreateBasesDto)
	@AppGuards(Role.Admin)
	@Post("addBase/withChildren")
	@AppResponse("2007")
	async addNewBaseWithChildren(@Body() body: CreateBasesDto): Promise<BaseDto> {
		return await this.typeService.createWithChildren(body);
	}
	// update pre types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Patch("updateBy/:id")
	@AppResponse("2008")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<BaseDto> {
		return await this.typeService.updateById(id, body);
	}
	// delete types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	@AppResponse("2008")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<BaseDto> {
		return await this.typeService.removeById(id);
	}
}
