import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";

import { Bases } from "./base.entity";
import { CreateBaseDto } from "./base.dto";

@Injectable()
export class BaseService {
	constructor(@InjectRepository(Bases) private repo: TreeRepository<Bases>) {}
	// findAll
	async findBases(): Promise<Bases[]> {
		return await this.repo.findTrees();
	}
	// create
	async create({ parentId, ...baseParams }: CreateBaseDto): Promise<Bases> {
		if (parentId) {
			const baseParent = await this.findById(parentId);
			Object.assign(baseParams, { parent: baseParent });
		}
		const base = this.repo.create(baseParams);
		return this.repo.save(base);
	}
	// update
	async updateById(id: number, attrs: Partial<Bases>): Promise<Bases> {
		const base = await this.findById(id);
		if (!base) {
			throw new NotFoundException("base not found");
		}
		Object.assign(base, attrs);
		return await this.repo.save(base);
	}
	// remove
	async removeById(id: number): Promise<Bases> {
		const base = await this.findById(id);
		if (!base) {
			throw new NotFoundException("base not found");
		}
		return await this.repo.remove(base);
	}
	// findOne
	async findById(id: number): Promise<Bases> {
		const options: FindOneOptions<Bases> = { where: { id } }; // FindManyOptions
		const base = await this.repo.findOne(options);
		if (!base) {
			throw new NotFoundException("base not found");
		}
		return base;
	}
}
