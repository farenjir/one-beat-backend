import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

import { pickBy } from "lodash";

import { Users } from "./user.entity";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(Users) private repo: Repository<Users>) {}
	// create
	async create(email: string, password: string): Promise<Users> {
		const user = this.repo.create({ email, password });
		return this.repo.save(user);
	}
	// findAll
	async findUsers(): Promise<Users[]> {
		return await this.repo.find();
	}
	// findOne
	async findBy(id?: number, email?: string): Promise<Users> {
		if (!id && !email) {
			throw new BadRequestException("4000");
		}
		const options: FindOneOptions<Users> = { where: pickBy<object>({ id, email }, (isTruthy: any) => isTruthy) };
		const user = await this.repo.findOne(options);
		if (!user) {
			throw new NotFoundException("4001");
		}
		return user;
	}
	// update
	async updateById(id: number, attrs: Partial<Users>): Promise<Users> {
		const user = await this.findBy(id);
		Object.assign(user, attrs);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findBy(id);
		return await this.repo.remove(user);
	}
}
