import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { Request } from "express";

import { pickBy as _pickBy } from "lodash";

import { Role } from "global/guards.decorator";
import { UsersService } from "modules/user/user.service";

import { Products } from "./product.entity";
import { CreateUpdateProductDto } from "./product.dto";

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
	async findOne(id: number): Promise<Products> {
		const options: FindOneOptions<Products> = {
			where: _pickBy<object>({ id }, (isTruthy: unknown) => isTruthy),
		};
		const product = await this.repo.findOne(options);
		if (product) {
			return product;
		} else {
			throw new NotFoundException("4013");
		}
	}
	// create one
	async createOne({ level, status, ...productAttrs }: CreateUpdateProductDto, req: Request): Promise<Products> {
		const user = await this.usersService.findBy({ id: req?.user?.id }, true);
		if (this.checkLevel(req)) {
			Object.assign(productAttrs, { level, status });
		}
		const product = this.repo.create({ ...productAttrs, producer: user });
		return await this.repo.save(product);
	}
	// create one
	async updateOne(
		id: number,
		{ level, status, ...updatedAttrs }: Partial<CreateUpdateProductDto>,
		{ user }: Pick<Request, "user">,
	): Promise<Products> {
		const product = await this.findOne(id);
		if (this.checkLevel({ user })) {
			Object.assign(updatedAttrs, { level, status });
		}
		if (this.checkCreator({ user }, product.producer.id) || this.checkLevel({ user })) {
			return await this.repo.save(product);
		} else {
			throw new UnauthorizedException("4012");
		}
	}
	// delete one
	async deleteOne(id: number, { user }: Pick<Request, "user">): Promise<Products> {
		const product = await this.findOne(id);
		if (this.checkCreator({ user }, product.producer.id) || this.checkLevel({ user })) {
			return await this.repo.remove(product);
		} else {
			throw new UnauthorizedException("4012");
		}
	}
	// *** handles
	checkLevel({ user }: Pick<Request, "user">) {
		const { role } = user;
		return [Role.Admin, Role.Editor].includes(role);
	}
	checkCreator({ user }: Pick<Request, "user">, creatorUserId: number) {
		const { id } = user;
		return creatorUserId === id;
	}
}
