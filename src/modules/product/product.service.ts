import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy } from "lodash";

import { UsersService } from "modules/user/user.service";

import { Products } from "./product.entity";
import { CreateProductDto } from "./product.dto";

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Products) private repo: Repository<Products>,
		private usersService: UsersService,
	) {}
	// find all
	async findAll(): Promise<Products[]> {
		return await this.repo.find();
	}
	// find one
	async findOne(id: string): Promise<Products> {
		const options: FindOneOptions<Products> = {
			where: _pickBy<object>({ id }, (isTruthy: unknown) => isTruthy),
		};
		const product = await this.repo.findOne(options);
		if (product) {
			return product;
		} else {
			throw new BadRequestException("4000");
		}
	}
	// create one
	async createOne(body: CreateProductDto, userId: number): Promise<Products> {
		const user = await this.usersService.findBy({ id: userId }, true);
		const product = this.repo.create({ ...body, producer: user });
		return await this.repo.save(product);
	}
}
