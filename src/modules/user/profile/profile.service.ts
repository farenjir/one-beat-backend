import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { pickBy as _pickBy } from "lodash";

import { BaseService } from "modules/base/bases.service";

import { Profile } from "./profile.entity";
import { UpdateProfileDto, CreateSaveProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(Profile) private repo: Repository<Profile>, private baseService: BaseService) {}
	// create
	async create(params: CreateSaveProfileDto): Promise<Profile> {
		const { genderId, ...other } = params;
		// relations
		const gender = await this.baseService.findBase(genderId);
		// create
		const profile = this.repo.create({ gender, ...other });
		return this.repo.save(profile);
	}
	// findAll
	async find(): Promise<Profile[]> {
		const options: FindManyOptions<Profile> = {
			relations: ["gender"],
		};
		return await this.repo.find(options);
	}
	// findOne
	async findBy(id: number): Promise<Profile> {
		const options: FindOneOptions<Profile> = {
			where: _pickBy<object>({ id }, (isTruthy: any) => isTruthy),
			relations: ["gender"],
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<UpdateProfileDto>): Promise<Profile> {
		const profile = await this.findBy(id);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		const { genderId, ...other } = attrs;
		// updatedRelations
		const gender = genderId ? await this.baseService.findBase(genderId) : null;
		// relations
		const relations = _pickBy<object>({ gender }, (isTruthy: any) => isTruthy);
		// updateUserData
		Object.assign(profile, other, relations);
		return await this.repo.save(profile);
	}
	// remove
	async removeById(id: number): Promise<Profile> {
		const profile = await this.findBy(id);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		return await this.repo.remove(profile);
	}
}
