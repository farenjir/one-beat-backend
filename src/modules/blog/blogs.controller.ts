import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { Serialize } from "global/serialize.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { BlogServices } from "./blogs.service";
import { BlogDto, BlogQuery, CreateUpdateDto } from "./blog.dto";
import { blogQuerySchema } from "./blog.schema";

@ApiTags("Blogs")
@Controller("blog")
@Serialize(BlogDto)
export class BlogsController {
	constructor(private readonly blogServices: BlogServices) {}
	// get all by query
	@SwaggerDocumentaryApi(BlogDto, { response: ResEnum.ArrayWithCount, useAuth: false, query: blogQuerySchema })
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async getProducts(@Query() queryParams: BlogQuery): Promise<[BlogDto[], number]> {
		return await this.blogServices.findAll(queryParams);
	}
	// find by query
	@SwaggerDocumentaryApi(BlogDto, { useAuth: false, query: blogQuerySchema.slice(2, 5) })
	@Get("getProduct")
	@ResponseMessage("")
	async getProducerProducts(@Query() queryParams: Pick<BlogQuery, "id" | "enTitle" | "faTitle">): Promise<BlogDto> {
		return await this.blogServices.findOne(queryParams);
	}
	// add new
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Post("addBlog")
	@ResponseMessage("2023")
	async addNewBase(@Req() req: Request, @Body() body: CreateUpdateDto): Promise<BlogDto> {
		return await this.blogServices.createOne(body, req);
	}
	// update
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Put("updateBy/:id")
	@ResponseMessage("2024")
	async updateBase(@Req() req: Request, @Param("id", ParseIntPipe) id: number, @Body() body: CreateUpdateDto): Promise<BlogDto> {
		return await this.blogServices.updateOne(id, body, req);
	}
	// delete
	@SwaggerDocumentaryApi(CreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.Author)
	@Delete("deleteBy/:id")
	@ResponseMessage("2025")
	async deleteBase(@Req() req: Request, @Param("id", ParseIntPipe) id: number): Promise<CreateUpdateDto> {
		return await this.blogServices.deleteOne(id, req);
	}
}
