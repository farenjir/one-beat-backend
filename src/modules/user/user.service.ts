import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy } from "lodash";
import { hashPassword } from "modules/auth/auth.configs";

import { ProfileService } from "./profile/profile.service";

import { Users } from "./user.entity";
import { CreateSaveUserDto, UpdateUserDto } from "./user.dto";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private repo: Repository<Users>, private profileService: ProfileService) {}
	// create
	async create(params: CreateSaveUserDto): Promise<Users> {
		const { email, password, profile } = params;
		// relations
		const profileCreated = await this.profileService.create(profile);
		// create
		const user = this.repo.create({ email, password, profile: profileCreated });
		return this.repo.save(user);
	}
	// findAll
	async findUsers(): Promise<Users[]> {
		const options: FindManyOptions<Users> = {
			relations: ["profile"],
		};
		return await this.repo.find(options);
	}
	// findOne
	async findBy(id?: number, email?: string): Promise<Users> {
		if (!id && !email) {
			throw new BadRequestException("4000");
		}
		const options: FindOneOptions<Users> = {
			where: _pickBy<object>({ id, email }, (isTruthy: any) => isTruthy),
			relations: ["profile"],
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<UpdateUserDto>): Promise<Users> {
		const user = await this.findBy(id);
		if (!user) {
			throw new NotFoundException("4001");
		}
		const { profile: currentProfile } = user;
		const { profile, password, ...other } = attrs;
		// updatedRelations
		const profileUpdated = await this.profileService.updateById(currentProfile.id, profile);
		// hashedPassword
		const hashedPassword = password ? await hashPassword(password) : null;
		// relations
		const relations = _pickBy<object>(
			{ password: hashedPassword, profile: profileUpdated },
			(isTruthy: any) => isTruthy,
		);
		// updateUserData
		Object.assign(user, other, relations);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findBy(id);
		if (!user) {
			throw new NotFoundException("4001");
		}
		return await this.repo.remove(user);
	}
}
