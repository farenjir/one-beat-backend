import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { Serialize } from "global/serialize.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { ProductsService } from "./blogs.service";
import { ProductDto, CreateUpdateProductDto, ProductQuery } from "./blog.dto";
import { productPaginationSchema, productQuerySchema } from "./blog.schema";

@ApiTags("Products")
@Controller("product")
@Serialize(ProductDto)
export class ProductsController {
	constructor(private readonly productServices: ProductsService) {}
	// get all product
	@SwaggerDocumentaryApi(ProductDto, { response: ResEnum.ArrayWithCount, useAuth: false, query: productPaginationSchema })
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async getProducts(@Query() queryParams: Pick<ProductQuery, "page" | "take">): Promise<[ProductDto[], number]> {
		return await this.productServices.findAll(queryParams);
	}
	// find by Query
	@SwaggerDocumentaryApi(ProductDto, { response: ResEnum.ArrayWithCount, useAuth: false, query: productQuerySchema })
	@Get("queries")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async getProducerProducts(@Query() queryParams: ProductQuery): Promise<[ProductDto[], number]> {
		return await this.productServices.findByQuery(queryParams);
	}
	// add new product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Post("addProduct")
	@ResponseMessage("2020")
	async addNewBase(@Req() req: Request, @Body() body: CreateUpdateProductDto): Promise<ProductDto> {
		return await this.productServices.createOne(body, req);
	}
	// update product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Put("updateBy/:productId")
	@ResponseMessage("2021")
	async updateBase(
		@Req() req: Request,
		@Param("productId", ParseIntPipe) id: number,
		@Body() body: CreateUpdateProductDto,
	): Promise<ProductDto> {
		return await this.productServices.updateOne(id, body, req);
	}
	// delete product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Delete("deleteBy/:productId")
	@ResponseMessage("2022")
	async deleteBase(@Req() req: Request, @Param("productId", ParseIntPipe) id: number): Promise<CreateUpdateProductDto> {
		return await this.productServices.deleteOne(id, req);
	}
}
