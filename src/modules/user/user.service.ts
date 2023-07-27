import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}
	// create
	async create(email: string, password: string): Promise<User> {
		const user = this.repo.create({ email, password });
		return this.repo.save(user);
	}
	// findAll
	async findUsers(): Promise<User[]> {
		return await this.repo.find();
	}
	// findOne
	async findById(id: number): Promise<User | null> {
		const options: FindOneOptions<User> = { where: { id } };
		const user = await this.repo.findOne(options);
		return user || null;
	}
	// findOne
	async findByEmail(email: string): Promise<User> {
		const options: FindManyOptions<User> = { where: { email } };
		return await this.repo.findOne(options);
	}
	// update
	async updateById(id: number, attrs: Partial<User>) {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		Object.assign(user, attrs);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number) {
		const user = await this.findById(id);
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return await this.repo.remove(user);
	}
}
