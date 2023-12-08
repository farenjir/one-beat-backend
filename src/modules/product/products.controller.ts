import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ProductsService } from "./product.service";

@ApiTags("Products")
@Controller("product")
export class ProductsController {
	constructor(private readonly productServices: ProductsService) {}
}
