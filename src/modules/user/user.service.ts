import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy } from "lodash";
import { hashPassword } from "modules/auth/auth.configs";

import { BaseService } from "modules/base/bases.service";

import { Users } from "./user.entity";
import { CreateSaveUserDto, UpdateUserDto } from "./user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private repo: Repository<Users>,
		private baseService: BaseService,
	) {}
	// create
	async create(params: CreateSaveUserDto): Promise<Users> {
		const { genderId, ...other } = params;
		// relations
		const gender = await this.baseService.findBase(genderId);
		// create
		const user = this.repo.create({ gender, ...other });
		return this.repo.save(user);
	}
	// findAll
	async findUsers(): Promise<Users[]> {
		const options: FindManyOptions<Users> = {
			relations: ["gender"],
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
			relations: ["gender"],
		};
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<UpdateUserDto>): Promise<Users> {
		const user = await this.findBy(id);
		if (!user) {
			throw new NotFoundException("4001");
		}
		const { genderId, password, ...other } = attrs;
		// updatedRelations
		const gender = genderId ? await this.baseService.findBase(genderId) : null;
		// hashedPassword
		const hashedPassword = password ? await hashPassword(password) : null;
		// relations
		const relations = _pickBy<object>({ gender, password: hashedPassword }, (isTruthy: any) => isTruthy);
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
