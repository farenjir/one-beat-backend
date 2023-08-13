import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

import { pickBy as _pickBy, size as _size } from "lodash";

import { Upload } from "./upload.entity";
import { FileDto, UploadQueryDto, UploadDto } from "./upload.dto";

@Injectable()
export class UploadService {
	constructor(@InjectRepository(Upload) private repo: Repository<Upload>) {}
	// create
	async create({ description, type, category }: UploadDto, { filename: name }: FileDto, { id }): Promise<Upload> {
		const params = {
			userId: id,
			name,
			description,
			type,
			category,
		};
		const file = this.repo.create(params);
		return this.repo.save(file);
	}
	// findAll
	async findFiles(): Promise<Upload[]> {
		return await this.repo.find();
	}
	// findOne
	async findById(id: string): Promise<Upload> {
		const options: FindOneOptions<Upload> = {
			where: { id },
		};
		const file = await this.repo.findOne(options);
		if (!file) {
			throw new NotFoundException("4005");
		}
		return file;
	}
	// findMany
	async findBy(query: UploadQueryDto): Promise<Upload[]> {
		if (_size(query)) {
			throw new BadRequestException("4000");
		}
		const options: FindManyOptions<Upload> = {
			where: _pickBy<object>(query, (isTruthy: any) => isTruthy),
		};
		const files = await this.repo.find(options);
		if (!files) {
			throw new NotFoundException("4005");
		}
		return files;
	}
	// update
	async updateById(id: string, attrs: Partial<Upload>): Promise<Upload> {
		const file = await this.findById(id);
		Object.assign(file, attrs);
		return await this.repo.save(file);
	}
	// remove
	async removeById(id: string): Promise<Upload> {
		const file = await this.findById(id);
		return await this.repo.remove(file);
	}
}
