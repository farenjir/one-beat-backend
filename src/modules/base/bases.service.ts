import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindTreeOptions, TreeRepository } from "typeorm";

import { pickBy as _pickBy, isEmpty as _isEmpty } from "lodash";

import { VersionService } from "modules/version/versions.service";

import { Bases } from "./base.entity";
import { CreateBaseDto, UpdateBaseDto, BaseQuery, BasesQuery } from "./base.dto";
import { defaultEnumAndBaseApp } from "./base.schedule";

@Injectable()
export class BaseService {
	constructor(
		@InjectRepository(Bases) private repo: TreeRepository<Bases>,
		readonly versionServices: VersionService,
	) {}
	// findAll
	async findAll(): Promise<Bases[]> {
		const options: FindTreeOptions = { relations: ["children"] };
		return await this.repo.findTrees(options);
	}
	// findOne
	async findOne({ id, type }: BaseQuery, ignoreValidBase = false, isParentBase = false): Promise<Bases> {
		const options: FindOneOptions<Bases> = {
			where: _pickBy<object>({ id, type }, (isTruthy: unknown) => isTruthy),
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const base = await this.repo.findOne(options);
		if (!ignoreValidBase && !base) {
			throw new NotFoundException(isParentBase ? "4008" : "4004");
		}
		return base;
	}
	// findChildren
	async findBaseChildren({ parentId: id, parentType: type }: BasesQuery): Promise<Bases[]> {
		if (_isEmpty({ id, type })) {
			throw new BadRequestException("4000");
		}
		const options: FindTreeOptions = { relations: ["parent", "children"] };
		// get parent
		const parent = await this.findOne({ id, type }, false, true);
		return (await this.repo.findDescendantsTree(parent, options))?.children;
	}
	// create
	async createOne({ parentId = 0, ...baseParams }: CreateBaseDto): Promise<Bases> {
		if (parentId) {
			const parent = await this.findOne({ id: parentId }, false, true);
			Object.assign(baseParams, { parent });
		}
		const base = this.repo.create(baseParams);
		if (base) {
			await this.versionServices.updateVersion(); // update version of the appBases
		}
		return await this.repo.save(base);
	}
	// update
	async updateById(id: number, baseParams: Partial<UpdateBaseDto>): Promise<Bases> {
		const base = await this.findOne({ id }, true);
		Object.assign(base, baseParams);
		if (base) {
			await this.versionServices.updateVersion(); // update version of the appBases
		}
		return await this.repo.save(base);
	}
	// remove
	async removeById(id: number): Promise<Bases> {
		const base = await this.findOne({ id });
		return await this.repo.remove(base);
	}
	// *** schedule to make default bases ***
	async scheduleDefaultBases(): Promise<void> {
		defaultEnumAndBaseApp.forEach(async ({ type, children: childrenEnums }) => {
			// parent
			const parent = (await this.findOne({ type }, true)) || (await this.createOne({ type, faName: type, enName: type }));
			// enums
			const typeNames = Object.values(childrenEnums);
			// children
			const baseChildren = (await this.findBaseChildren({ parentType: type })) || [];
			const baseChildrenTypes = baseChildren.map(({ type }) => type);
			// createNewType
			typeNames.forEach(async (value) => {
				if (!baseChildrenTypes.includes(value)) {
					const newBase = await this.createOne({ type: value, faName: value, enName: value, parentId: parent.id });
					if (newBase) {
						await this.versionServices.updateVersion(); // update version of the appBases
					}
				}
			});
		});
	}
}
