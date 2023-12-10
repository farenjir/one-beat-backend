import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

import { pickBy as _pickBy } from "lodash";

import { Profile } from "./profile.entity";
import { UpdateProfileDto, CreateSaveProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}
	// create
	async create(params: CreateSaveProfileDto): Promise<Profile> {
		const profile = this.repo.create(params);
		return await this.repo.save(profile);
	}
	// findAll
	async find(): Promise<Profile[]> {
		return await this.repo.find();
	}
	// findOne
	async findById(profileId: number): Promise<Profile> {
		const options: FindOneOptions<Profile> = {
			where: _pickBy<object>({ id: profileId }, (isTruthy: unknown) => isTruthy),
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(profileId: number, attrs: Partial<UpdateProfileDto>): Promise<Profile> {
		const profile = await this.findById(profileId);
		if (!profile) {
			throw new NotFoundException("4001");
		}
		// updateUserData
		Object.assign(profile, attrs);
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
}
