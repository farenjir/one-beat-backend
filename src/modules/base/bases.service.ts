import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";

import { pickBy as _pickBy } from "lodash";

import { Bases } from "./base.entity";
import { CreateBaseDto, UpdateBaseDto } from "./base.dto";

@Injectable()
export class BaseService {
	constructor(@InjectRepository(Bases) private repo: TreeRepository<Bases>) {}
	// findAll
	async findAllBases(): Promise<Bases[]> {
		const options: FindTreeOptions = { relations: ["children"] };
		return await this.repo.findTrees(options);
	}
	// findOne
	async findBase(id?: number, type?: string): Promise<Bases> {
		if (!id && !type) {
			throw new BadRequestException("4000");
		}
		const options: FindOneOptions<Bases> = {
			where: _pickBy<object>({ id, type }, (isTruthy: unknown) => isTruthy),
		};
		return await this.repo.findOne(options);
	}
	// findChildren
	async findBaseChildren(parentId?: number, parentType?: string): Promise<Bases[]> {
		if (!parentId && !parentType) {
			throw new BadRequestException("4000");
		}
		const parent = await this.findBase(parentId, parentType);
		if (!parent) {
			throw new NotFoundException("4008");
		}
		const options: FindTreeOptions = { relations: ["parent", "children"] };
		const { children } = (await this.repo.findDescendantsTree(parent, options)) || {};
		return children;
	}
	// create
	async create({ parentId = 0, ...baseParams }: CreateBaseDto): Promise<Bases> {
		if (parentId) {
			const parent = await this.findBase(parentId);
			if (!parent) {
				throw new NotFoundException("4008");
			}
			Object.assign(baseParams, { parent });
		}
		const base = this.repo.create(baseParams);
		return await this.repo.save(base);
	}
	// update
	async updateById(id: number, { parentId, ...baseParams }: Partial<UpdateBaseDto>): Promise<Bases> {
		const base = await this.findBase(id);
		if (!base) {
			throw new NotFoundException("4004");
		}
		if (parentId) {
			const parent = await this.findBase(parentId);
			if (!parent) {
				throw new NotFoundException("4008");
			}
			Object.assign(baseParams, { parent });
		}
		Object.assign(base, baseParams);
		return await this.repo.save(base);
	}
	// remove
	async removeById(id: number): Promise<Bases> {
		const base = await this.findBase(id);
		if (!base) {
			throw new NotFoundException("4004");
		}
		return await this.repo.remove(base);
	}
}
