import { FindOneOptions, Repository } from "typeorm";
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
		private readonly baseService: BaseService,
	) {}
	// create
	async create(params: CreateSaveProfileDto): Promise<Profile> {
		// relations
		const { gender, expertise, skills, favorites, ...profileData }: Partial<Profile> = await this.getRelationsParams(params);
		// create
		const profile = this.repo.create({ gender, expertise, skills, favorites, ...profileData });
		return this.repo.save(profile);
	}
	// findAll
	async find(): Promise<Profile[]> {
		return await this.repo.find();
	}
	// findOne
	async findById(profileId: number): Promise<Profile> {
		const options: FindOneOptions<Profile> = {
			where: _pickBy<object>({ id: profileId }, (isTruthy: unknown) => isTruthy),
			// relations: ["gender", "expertise", "skills", "favorites"],
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(profileId: number, attrs: Partial<UpdateProfileDto>): Promise<Profile> {
		const profile = await this.findById(profileId);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		// updatedRelations
		const { gender, expertise, skills, favorites, ...profileData }: Partial<Profile> = await this.getRelationsParams(attrs);
		// updateUserData
		Object.assign(profile, profileData, { gender, favorites, skills, expertise });
		return await this.repo.save(profile);
	}
	// remove
	async removeById(profileId: number): Promise<Profile> {
		const profile = await this.findById(profileId);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		return await this.repo.remove(profile);
	}
	async createOrUpdate(profileId: number | undefined, profile: CreateSaveProfileDto): Promise<Profile> {
		// profile
		return profileId ? await this.updateById(profileId, profile) : await this.create(profile);
	}
	// handles
	private async getRelationsParams(params: CreateSaveProfileDto | Partial<UpdateProfileDto>): Promise<Partial<Profile>> {
		const { genderId, expertiseIds, skillsIds, favoritesIds, ...other } = params;
		// findBases
		const findBase = async (id: number) => await this.baseService.findBase(id);
		const [gender, expertise, skills, favorites] = await Promise.all([
			findBase(genderId),
			Promise.all(expertiseIds.map(findBase)),
			Promise.all(skillsIds.map(findBase)),
			Promise.all(favoritesIds.map(findBase)),
		]);
		// return
		return { gender, expertise, skills, favorites, ...other };
	}
}
