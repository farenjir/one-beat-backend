import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { TagsService } from "./tags.service";
import { CreateDto, TagDto, TagQuery } from "./tag.dto";
import { getTagSchema } from "./tag.schema";

@ApiTags("Tags")
@Controller("tag")
export class TagsController {
	constructor(private readonly tagServices: TagsService) {}
	// get all byQuery
	@SwaggerDocumentaryApi(TagDto, { response: ResEnum.Array, useAuth: false, query: getTagSchema.slice(1) })
	@Get("all")
	@ResponseMessage("")
	async getTagsByQuery(@Query() queryParams: TagQuery): Promise<TagDto[]> {
		return await this.tagServices.findAll(queryParams);
	}
	// findOne
	@SwaggerDocumentaryApi(TagDto, { useAuth: false, query: getTagSchema.slice(0, 2) })
	@Get("getTag")
	@ResponseMessage("")
	async getTagByQuery(@Query() queryParams: TagQuery): Promise<TagDto> {
		return await this.tagServices.findOne(queryParams);
	}
	// add new
	@SwaggerDocumentaryApi(CreateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Post("addNew")
	@ResponseMessage("2020")
	async addNewBase(@Body() body: CreateDto): Promise<TagDto> {
		return await this.tagServices.createOne(body);
	}
	// update
	@SwaggerDocumentaryApi(CreateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Put("updateBy/:id")
	@ResponseMessage("2021")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: CreateDto): Promise<TagDto> {
		return await this.tagServices.updateBy({ id }, body);
	}
	// delete
	@SwaggerDocumentaryApi(CreateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Delete("deleteBy/:id")
	@ResponseMessage("2022")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<CreateDto> {
		return await this.tagServices.removeBy({ id });
	}
}
