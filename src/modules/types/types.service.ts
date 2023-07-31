import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";

import { Types } from "./type.entity";
import { CreateTypeDto } from "./type.dto";

@Injectable()
export class TypesService {
	constructor(@InjectRepository(Types) private repo: TreeRepository<Types>) {}
	// findAll
	async findTypes(): Promise<Types[]> {
		const options: FindTreeOptions = { depth: 2 };
		return await this.repo.findTrees(options);
	}
	// create
	async create(typeParams: CreateTypeDto): Promise<Types> {
		const type = this.repo.create(typeParams);
		return this.repo.save(type);
	}
	// update
	async updateById(id: number, attrs: Partial<Types>): Promise<Types> {
		const type = await this.findById(id);
		if (!type) {
			throw new NotFoundException("type not found");
		}
		Object.assign(type, attrs);
		return await this.repo.save(type);
	}
	// remove
	async removeById(id: number): Promise<Types> {
		const type = await this.findById(id);
		if (!type) {
			throw new NotFoundException("type not found");
		}
		return await this.repo.remove(type);
	}
	// findOne
	async findById(id: number): Promise<Types> {
		const options: FindOneOptions<Types> = { where: { id } }; // FindManyOptions
		const type = await this.repo.findOne(options);
		if (!type) {
			throw new NotFoundException("type not found");
		}
		return type;
	}
}
