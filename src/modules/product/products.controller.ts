import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { ProductsService } from "./product.service";
import { ProductDto, CreateUpdateProductDto } from "./product.dto";

@ApiTags("Products")
@Controller("product")
export class ProductsController {
	constructor(private readonly productServices: ProductsService) {}
	// get all product
	@SwaggerDocumentaryApi(ProductDto, { responseIsObject: false, useAuth: false })
	@Get("all")
	@ResponseMessage("")
	async getProducts(): Promise<ProductDto[]> {
		return await this.productServices.findAll();
	}
	// top products
	@SwaggerDocumentaryApi(ProductDto, { responseIsObject: false, useAuth: false })
	@Get("topProducts")
	@ResponseMessage("")
	async getTopProducts(): Promise<ProductDto[]> {
		return await this.productServices.findAll();
	}
	// find one product
	@SwaggerDocumentaryApi(ProductDto, { responseIsObject: false, useAuth: false })
	@Get("getProduct")
	@ResponseMessage("")
	async getProduct(@Param("id") id: string): Promise<ProductDto> {
		return await this.productServices.findOne(id);
	}
	// add new product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.User)
	@Post("addProduct")
	@ResponseMessage("")
	async addNewBase(@Req() { user }: Request, @Body() body: CreateUpdateProductDto): Promise<ProductDto> {
		return await this.productServices.createOne(body, user?.id);
	}
	// update product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.User)
	@Put("updateBy/:id")
	@ResponseMessage("")
	async updateBase(@Req() { user }: Request, @Param("id") id: string, @Body() body: CreateUpdateProductDto): Promise<ProductDto> {
		return await this.productServices.updateOne(id, body, user?.roles);
	}
	// delete product
	@SwaggerDocumentaryApi(CreateUpdateProductDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer, Role.User)
	@Delete("deleteBy/:id")
	@ResponseMessage("")
	async deleteBase(@Req() { user }: Request, @Param("id") id: string): Promise<CreateUpdateProductDto> {
		return await this.productServices.deleteOne(id, user?.roles);
	}
}
