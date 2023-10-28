import { Body, Controller, Delete, Get, ParseIntPipe, Put, Post, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { BaseService } from "./bases.service";
import { ValidationQueryPipe } from "./bases.pipe";
import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, CreateBasesDto } from "./base.dto";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { responseIsObject: false, useAuth: false })
	@Get("getAll")
	@ResponseMessage("")
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
	@ResponseMessage("")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) { parentId, parentType }: BaseQuery = {}): Promise<BaseDto[]> {
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
	@ResponseMessage("")
	async getBase(@Query(new ValidationQueryPipe()) { baseId, baseType }: BaseQuery = {}): Promise<BaseDto> {
		return await this.typeService.findBase(baseId, baseType);
	}
	// add new types
	@SwaggerDocumentaryApi(CreateBaseDto)
	@AppGuards(Role.Admin)
	@Post("addBase")
	@ResponseMessage("2007")
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.typeService.create(body);
	}
	@SwaggerDocumentaryApi(CreateBasesDto)
	@AppGuards(Role.Admin)
	@Post("addBase/withChildren")
	@ResponseMessage("2007")
	async addNewBaseWithChildren(@Body() body: CreateBasesDto): Promise<BaseDto> {
		return await this.typeService.createWithChildren(body);
	}
	// update pre types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Put("updateBy/:id")
	@ResponseMessage("2008")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<BaseDto> {
		return await this.typeService.updateById(id, body);
	}
	// delete types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	@ResponseMessage("2008")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<BaseDto> {
		return await this.typeService.removeById(id);
	}
}
