import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { ProductsService } from "./product.service";

import { ProductDto } from "./product.dto";

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
}
