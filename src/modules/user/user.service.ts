import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

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
	async findById(id: number): Promise<Users> {
		const options: FindOneOptions<Users> = { where: { id } };
		const user = await this.repo.findOne(options);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return user;
	}
	// findOne
	async findByEmail(email: string): Promise<Users> {
		const options: FindManyOptions<Users> = { where: { email } };
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<Users>): Promise<Users> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		Object.assign(user, attrs);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return await this.repo.remove(user);
	}
}
