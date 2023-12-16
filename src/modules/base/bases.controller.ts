import { Body, Controller, Delete, Get, ParseIntPipe, Put, Post, Query, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "global/guards.decorator";
import { EnumRes, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { BaseService } from "./bases.service";
import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery } from "./base.dto";
import { ValidationQueryPipe } from "./bases.pipe";
import { addDescription, getBaseSchema, getChildrenSchema } from "./base.schema";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { response: EnumRes.Array, useAuth: false })
	@Get("all")
	@ResponseMessage("", "", EnumRes.Array)
	async getBases(): Promise<BaseDto[]> {
		return await this.typeService.findAllBases();
	}
	// get children of type
	@SwaggerDocumentaryApi(BaseDto, { response: EnumRes.ArrayWithCount, useAuth: false, query: getChildrenSchema })
	@Get("children")
	@ResponseMessage("")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) { parentId, parentType }: BaseQuery = {}): Promise<BaseDto[]> {
		return await this.typeService.findBaseChildren(parentId, parentType);
	}
	// get one type
	@SwaggerDocumentaryApi(BaseDto, { useAuth: false, query: getBaseSchema })
	@Get("getBase")
	@ResponseMessage("")
	async getBase(@Query(new ValidationQueryPipe()) { baseId, baseType }: BaseQuery = {}): Promise<BaseDto> {
		return await this.typeService.findBase(baseId, baseType);
	}
	// add new types
	@SwaggerDocumentaryApi(CreateBaseDto, { description: addDescription })
	@AppGuards(Role.Admin)
	@Post("addBase")
	@ResponseMessage("2007")
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.typeService.create(body);
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
