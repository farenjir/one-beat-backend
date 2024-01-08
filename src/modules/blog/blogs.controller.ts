import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { Serialize } from "global/serialize.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { BlogServices } from "./blogs.service";
import { BlogDto, CreateUpdateDto, BlogQuery, BlogsQuery } from "./blog.dto";

@ApiTags("Blogs")
@Controller("blog")
@Serialize(BlogDto)
export class BlogsController {
	constructor(private readonly blogServices: BlogServices) {}
	// get all by query
	@SwaggerDocumentaryApi(BlogDto, { response: ResEnum.ArrayWithCount, useAuth: false })
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async getProducts(@Query() queryParams: BlogsQuery): Promise<[BlogDto[], number]> {
		return await this.blogServices.findAll(queryParams);
	}
	// find by query
	@SwaggerDocumentaryApi(BlogDto, { useAuth: false })
	@Get("getProduct")
	@ResponseMessage("")
	async getProducerProducts(@Query() queryParams: BlogQuery): Promise<BlogDto> {
		return await this.blogServices.findOne(queryParams);
	}
	// add new
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Post("addBlog")
	@ResponseMessage("2020")
	async addNewBase(@Req() req: Request, @Body() body: CreateUpdateDto): Promise<BlogDto> {
		return await this.blogServices.createOne(body, req);
	}
	// update
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Put("updateBy/:id")
	@ResponseMessage("2021")
	async updateBase(@Req() req: Request, @Param("id", ParseIntPipe) id: number, @Body() body: CreateUpdateDto): Promise<BlogDto> {
		return await this.blogServices.updateOne(id, body, req);
	}
	// delete
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Delete("deleteBy/:id")
	@ResponseMessage("2022")
	async deleteBase(@Req() req: Request, @Param("id", ParseIntPipe) id: number): Promise<CreateUpdateDto> {
		return await this.blogServices.deleteOne(id, req);
	}
}
