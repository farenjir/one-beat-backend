import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { ProductsService } from "./product.service";
import { ProductDto, CreateProductDto } from "./product.dto";

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
	// add new product
	@SwaggerDocumentaryApi(CreateProductDto)
	@AppGuards(Role.Admin)
	@Post("add")
	@ResponseMessage("")
	async addNewBase(@Req() { user }: Request, @Body() body: CreateProductDto): Promise<ProductDto> {
		return await this.productServices.createOne(body, user?.id);
	}
}
