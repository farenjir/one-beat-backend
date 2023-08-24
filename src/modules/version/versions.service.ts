import { FindOneOptions, Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Version } from "./version.entity";
import { VersionCreateUpdateDto } from "./version.dto";

@Injectable()
export class BaseService {
	constructor(@InjectRepository(Version) private repo: Repository<Version>) {}
	// findAll
	async find(): Promise<Version[]> {
		return await this.repo.find();
	}
	// findLatest
	async findLatest(): Promise<Version> {
		const options: FindOneOptions<Version> = {
			where: {},
			order: { id: "DESC" },
		};
		return await this.repo.findOne(options);
	}
	// findOne
	async findById(id: number, isValidVersion: boolean = false): Promise<Version> {
		const options: FindOneOptions<Version> = {
			where: { id },
		};
		const version = await this.repo.findOne(options);
		if (isValidVersion && !version) {
			throw new NotFoundException("4009");
		}
		return version;
	}
	// create
	async create(paramsObject: VersionCreateUpdateDto): Promise<Version> {
		const { appVersion: perApp = 0, baseVersion: perBase = 0 } = (await this.findLatest()) || {}; // 0 and {} for first version
		Object.assign(paramsObject, { appVersion: perApp + 1, baseVersion: perBase + 1 });
		const version = this.repo.create(paramsObject);
		return this.repo.save(version);
	}
	// update
	async updateById(id: number, paramsObject: Partial<VersionCreateUpdateDto>): Promise<Version> {
		const version = await this.findById(id, true);
		Object.assign(version, paramsObject);
		return await this.repo.save(version);
	}
	// remove
	async removeById(id: number): Promise<Version> {
		const version = await this.findById(id, true);
		return await this.repo.remove(version);
	}
}
