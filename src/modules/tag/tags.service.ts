import { FindManyOptions, FindOneOptions, Like, Repository } from "typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { isEmpty as _isEmpty, map as _map, pickBy as _pickBy } from "lodash";

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
			where: _pickBy<object>({ type, ...names }, (isTruthy: unknown) => isTruthy),
		};
		return await this.repo.find(options);
	}
	// findOne
	async findOne(queryParams: TagQuery = {}, ignoreValidateTag = false): Promise<Tags> {
		const options: FindOneOptions<Tags> = {
			where: _pickBy<object>(queryParams, (isTruthy: unknown) => isTruthy),
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const tag = await this.repo.findOne(options);
		if (!ignoreValidateTag && !tag) {
			throw new NotFoundException("4018");
		}
		return tag;
	}
	// create
	async createOne(params: CreateDto): Promise<Tags> {
		const nameAlreadyExists = await this.findOne({ name: params.name }, true);
		if (nameAlreadyExists) {
			throw new BadRequestException("4017");
		}
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
