import { FindManyOptions, FindOneOptions, Like, Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { isEmpty as _isEmpty, map as _map } from "lodash";

import { Tags } from "./tag.entity";
import { CreateDto, TagQuery, TagsQuery } from "./tag.dto";

@Injectable()
export class TagsService {
	constructor(@InjectRepository(Tags) private repo: Repository<Tags>) {}
	// findAll
	async findAll({ name, type }: TagsQuery = {}): Promise<Tags[]> {
		const names = this.queryContentHandler({ name });
		const options: FindManyOptions<Tags> = {
			order: { id: "DESC" },
			where: { type, ...names },
		};
		return await this.repo.find(options);
	}
	// findOne
	async findOne(queryParams: TagQuery = {}, ignoreValidateTag = false): Promise<Tags> {
		if (_isEmpty(queryParams)) {
			throw new BadRequestException("4000");
		}
		const options: FindOneOptions<Tags> = {
			where: queryParams,
		};
		const tag = await this.repo.findOne(options);
		if (tag || ignoreValidateTag) {
			return tag;
		} else {
			throw new NotFoundException("4009");
		}
	}
	// create
	async createOne(params: CreateDto): Promise<Tags> {
		const tag = this.repo.create(params);
		return await this.repo.save(tag);
	}
	// update
	async updateBy(queryParams: TagQuery, paramsObject: Partial<CreateDto>): Promise<Tags> {
		const tag = await this.findOne(queryParams);
		Object.assign(tag, paramsObject);
		return await this.repo.save(tag);
	}
	// remove
	async removeBy(queryParams: TagQuery): Promise<Tags> {
		const tag = await this.findOne(queryParams);
		return await this.repo.remove(tag);
	}
	// handles
	queryContentHandler(arrayQuery: typeof Like.arguments) {
		const object = {};
		_map(arrayQuery, (value: string, key: string) => {
			if (value?.length) {
				object[key] = Like(`%${value}%`);
			}
		});
		return object;
	}
}
