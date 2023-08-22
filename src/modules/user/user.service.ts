import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy, isEmpty as _isEmpty } from "lodash";
import { hashPassword } from "modules/auth/auth.configs";

import { ProfileService } from "./profile/profile.service";

import { Users } from "./user.entity";
import { CreateSaveUserDto, IUserQuery, UpdateProfileDto, UpdateUserDto } from "./user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private repo: Repository<Users>,
		private profileService: ProfileService,
	) {}
	// create
	async create(params: CreateSaveUserDto): Promise<Users> {
		// create
		const user = this.repo.create({ ...params, profile: {} });
		return this.repo.save(user);
	}
	// findAll
	async findUsers(): Promise<Users[]> {
		return await this.repo.find();
	}
	// findOne
	async findBy({ id, email, username }: IUserQuery, checkValidUser = false): Promise<Users> {
		const options: FindOneOptions<Users> = {
			where: _pickBy<object>({ id, email, username }, (isTruthy: any) => isTruthy),
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const user = await this.repo.findOne(options);
		if (checkValidUser && !user) {
			throw new NotFoundException("4001");
		}
		return user;
	}
	// findOne with profile
	async findUserWithProfile({ id }: Partial<IUserQuery>, checkValidUser = false): Promise<Users> {
		const options: FindOneOptions<Users> = {
			where: { id },
			relations: ["profile"],
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const user = await this.repo.findOne(options);
		if (checkValidUser && !user) {
			throw new NotFoundException("4001");
		}
		return user;
	}
	// update
	async updateById(id: number, attrs: Partial<UpdateUserDto>): Promise<Users> {
		const user = await this.findUserWithProfile({ id }, true);
		// payload
		const { password, roles, email, username } = attrs;
		// hashedPassword
		const hashedPassword = password ? await hashPassword(password) : null;
		// relations
		const updatedData = _pickBy<object>({ password: hashedPassword, roles, email, username }, (isTruthy: any) => isTruthy);
		// updateUserData
		Object.assign(user, updatedData);
		return await this.repo.save(user);
	}
	// update with profile
	async updateUserProfile(id: number, { profile }: Partial<UpdateProfileDto>): Promise<Users> {
		const user = await this.findUserWithProfile({ id }, true);
		const profileId = user?.profile?.id;
		// updatedProfile
		const profileUpdated = profileId
			? await this.profileService.updateById(profileId, profile)
			: await this.profileService.create(profile);
		// updateUserData
		Object.assign(user, { profile: profileUpdated });
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findBy({ id }, true);
		return await this.repo.remove(user);
	}
}
