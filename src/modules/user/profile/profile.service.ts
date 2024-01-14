import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { pickBy as _pickBy } from "lodash";

import { Profile } from "./profile.entity";
import { UpdateProfileDto, CreateSaveProfileDto } from "./profile.dto";

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}
	// create
	async create(params: CreateSaveProfileDto): Promise<Profile> {
		const nickNameDuplicated = await this.findById({ nickname: params.nickname });
		if (nickNameDuplicated) {
			throw new BadRequestException("4019");
		}
		const profile = this.repo.create(params);
		return await this.repo.save(profile);
	}
	// findAll
	async find(): Promise<Profile[]> {
		return await this.repo.find();
	}
	// findOne
	async findById({ id, nickname }: Partial<Profile>): Promise<Profile> {
		const options: FindOneOptions<Profile> = {
			where: _pickBy<object>({ id, nickname }, (isTruthy: unknown) => isTruthy),
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<UpdateProfileDto>): Promise<Profile> {
		const profile = await this.findById({ id });
		if (!profile) {
			throw new NotFoundException("4001");
		}
		// updateUserData
		Object.assign(profile, attrs);
		return await this.repo.save(profile);
	}
	// remove
	async removeById(id: number): Promise<Profile> {
		const profile = await this.findById({ id });
		if (!profile) {
			throw new NotFoundException("4001");
		}
		return await this.repo.remove(profile);
	}
	async createOrUpdate(id: number | undefined, profile: CreateSaveProfileDto): Promise<Profile> {
		// profile
		return id ? await this.updateById(id, profile) : await this.create(profile);
	}
}
