import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy, isEmpty as _isEmpty } from "lodash";
import { hashPassword } from "modules/auth/auth.configs";

import { ProfileService } from "./profile/profile.service";

import { Users } from "./user.entity";
import { CreateSaveUserDto, IUserQuery, UpdateUserDto } from "./user.dto";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private repo: Repository<Users>, private profileService: ProfileService) {}
	// create
	async create(params: CreateSaveUserDto): Promise<Users> {
		const { profile, ...accountInfo } = params;
		// relations
		const profileCreated = await this.profileService.create(profile);
		// create
		const user = this.repo.create({ ...accountInfo, profile: profileCreated });
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
	async findProfile({ id }: Partial<IUserQuery>, checkValidUser = false): Promise<Users> {
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
		const user = await this.findBy({ id }, true);
		const { profile: currentProfile } = user;
		// payload
		const { profile, password, ...otherPayload } = attrs;
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
		Object.assign(user, otherPayload, relations);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findBy({ id }, true);
		return await this.repo.remove(user);
	}
}
