import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { pickBy as _pickBy } from "lodash";

import { BaseService } from "modules/base/bases.service";

import { Profile } from "./profile.entity";
import { UpdateProfileDto, CreateSaveProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(Profile) private repo: Repository<Profile>,
		private baseService: BaseService,
	) {}
	// create
	async create(params: CreateSaveProfileDto): Promise<Profile> {
		const { genderId, expertiseIds, skillsIds, favoritesIds, ...other } = params;
		// relations
		const gender = await this.baseService.findBase(genderId);
		const expertise = await Promise.all(expertiseIds.map(async (id) => await this.baseService.findBase(id)));
		const skills = await Promise.all(skillsIds.map(async (id) => await this.baseService.findBase(id)));
		const favorites = await Promise.all(favoritesIds.map(async (id) => await this.baseService.findBase(id)));
		// create
		const profile = this.repo.create({ gender, expertise, skills, favorites, ...other });
		return this.repo.save(profile);
	}
	// findAll
	async find(): Promise<Profile[]> {
		return await this.repo.find();
	}
	// findOne
	async findBy(profileId: number): Promise<Profile> {
		const options: FindOneOptions<Profile> = {
			where: _pickBy<object>({ profileId }, (isTruthy: any) => isTruthy),
			// relations: ["gender", "expertise", "skills", "favorites"],
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(profileId: number, attrs: Partial<UpdateProfileDto>): Promise<Profile> {
		const profile = await this.findBy(profileId);
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
	async removeById(profileId: number): Promise<Profile> {
		const profile = await this.findBy(profileId);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		return await this.repo.remove(profile);
	}
}
