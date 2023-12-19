import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";

import { pickBy as _pickBy, isEmpty as _isEmpty } from "lodash";

import { Bases } from "./base.entity";
import { CreateBaseDto, UpdateBaseDto, BaseQuery, BasesQuery } from "./base.dto";

@Injectable()
export class BaseService {
	constructor(@InjectRepository(Bases) private repo: TreeRepository<Bases>) {}
	// findAll
	async findAll(): Promise<Bases[]> {
		const options: FindTreeOptions = { relations: ["children"] };
		return await this.repo.findTrees(options);
	}
	// findOne
	async findOne({ id, type }: BaseQuery): Promise<Bases> {
		if (_isEmpty({ id, type })) {
			throw new BadRequestException("4000");
		}
		const options: FindOneOptions<Bases> = {
			where: _pickBy<object>({ id, type }, (isTruthy: unknown) => isTruthy),
		};
		return await this.repo.findOne(options);
	}
	// findChildren
	async findBaseChildren({ parentId: id, parentType: type }: BasesQuery): Promise<Bases[]> {
		if (_isEmpty({ id, type })) {
			throw new BadRequestException("4000");
		}
		const parent = await this.findOne({ id, type });
		if (!parent) {
			throw new NotFoundException("4008");
		}
		const options: FindTreeOptions = { relations: ["parent", "children"] };
		return (await this.repo.findDescendantsTree(parent, options))?.children;
	}
	// create
	async create({ parentId = 0, ...baseParams }: CreateBaseDto): Promise<Bases> {
		if (parentId) {
			const parent = await this.findOne({ id: parentId });
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
		const base = await this.findOne({ id });
		if (!base) {
			throw new NotFoundException("4004");
		}
		if (parentId) {
			const parent = await this.findOne({ id: parentId });
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
		const base = await this.findOne({ id });
		if (!base) {
			throw new NotFoundException("4004");
		}
		return await this.repo.remove(base);
	}
}
