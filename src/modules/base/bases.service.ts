import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";
import { pickBy } from "lodash";

import { Bases } from "./base.entity";
import { CreateBaseDto, UpdateBaseDto } from "./base.dto";

@Injectable()
export class BaseService {
	constructor(@InjectRepository(Bases) private repo: TreeRepository<Bases>) {}
	// create
	async create({ parentId, ...baseParams }: CreateBaseDto): Promise<Bases> {
		if (parentId) {
			const parent = await this.findBase(parentId);
			Object.assign(baseParams, { parent });
		}
		const base = this.repo.create(baseParams);
		return this.repo.save(base);
	}
	// update
	async updateById(id: number, { parentId, ...baseParams }: Partial<UpdateBaseDto>): Promise<Bases> {
		const base = await this.findBase(id);
		if (!base) {
			throw new NotFoundException("Base not found");
		}
		if (parentId) {
			const parent = await this.findBase(parentId);
			Object.assign(baseParams, { parent });
		}
		Object.assign(base, baseParams);
		return await this.repo.save(base);
	}
	// remove
	async removeById(id: number): Promise<Bases> {
		const base = await this.findBase(id);
		if (!base) {
			throw new NotFoundException("Base not found");
		}
		return await this.repo.remove(base);
	}
	// findAll
	async findAllBases(): Promise<Bases[]> {
		const options: FindTreeOptions = { relations: ["children"] };
		return await this.repo.findTrees(options);
	}
	// findOne
	async findBase(id?: number, type?: string): Promise<Bases> {
		if (!id && !type) {
			throw new BadRequestException("Invalid Query");
		}
		const options: FindOneOptions<Bases> = {
			where: pickBy<object>({ id, type }, (isTruthy: any) => isTruthy),
		};
		const base = await this.repo.findOne(options);
		if (!base) {
			throw new NotFoundException("Base not found");
		}
		return base;
	}
	// findChildren
	async findBaseChildren(parentId?: number, parentType?: string): Promise<Bases[]> {
		if (!parentId && !parentType) {
			throw new BadRequestException("Invalid Query");
		}
		const parent = await this.findBase(parentId, parentType);
		const options: FindTreeOptions = { relations: ["parent", "children"] };
		const { children } = await this.repo.findDescendantsTree(parent, options);
		return children;
	}
}
