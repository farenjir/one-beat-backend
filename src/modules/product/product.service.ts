import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Products } from "./product.entity";

@Injectable()
export class ProductsService {
	constructor(@InjectRepository(Products) private repo: Repository<Products>) {}
}
