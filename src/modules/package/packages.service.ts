import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayContains, FindManyOptions, FindOneOptions, Like, Repository } from "typeorm";
import { Request } from "express";

import { pickBy as _pickBy, isEmpty as _isEmpty, map as _map } from "lodash";

import { Role } from "global/guards.decorator";
import { UsersService } from "modules/user/users.service";

import { Packages } from "./package.entity";
import { CreateUpdatePackageDto, PackageQuery, PackagesQuery } from "./package.dto";

@Injectable()
export class PackagesService {
	constructor(
		@InjectRepository(Packages) private repo: Repository<Packages>,
		private usersService: UsersService,
	) {}
	// find all by Query
	async findAll({ producerId: id, username, email, ...productParams }: PackagesQuery = {}): Promise<[Packages[], number]> {
		const { page = 1, take = 10, groupIds, genreIds, moodIds, tempoIds, faName, enName, ...otherParams } = productParams;
		// arrayQuery
		const bases = this.queryIdHandler({ groupIds, genreIds, moodIds, tempoIds });
		const names = this.queryContentHandler({ faName, enName });
		const producer = { id, ...this.queryContentHandler({ username, email }) };
		// options
		const options: FindManyOptions<Packages> = {
			order: { id: "DESC" },
			skip: page - 1,
			take,
			where: {
				producer,
				...names,
				...bases,
				...otherParams,
			},
		};
		return await this.repo.findAndCount(options);
	}
	// find one
	async findOne(queryParams: PackageQuery, ignoreValidateProduct = false): Promise<Packages> {
		const options: FindOneOptions<Packages> = {
			where: _pickBy<object>(queryParams, (isTruthy: unknown) => isTruthy),
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const packageItem = await this.repo.findOne(options);
		if (!ignoreValidateProduct && !packageItem) {
			throw new NotFoundException("4013");
		}
		return packageItem;
	}
	// create one
	async createOne({ level, status, ...productAttrs }: CreateUpdatePackageDto, req: Request): Promise<Packages> {
		const nameAlreadyExists = await this.duplicatedProductName(productAttrs);
		if (nameAlreadyExists) {
			throw new BadRequestException("4014");
		}
		const user = await this.usersService.findOne({ id: req?.user?.id }, true);
		if (this.checkLevel(req)) {
			Object.assign(productAttrs, { level, status });
		}
		const packageItem = this.repo.create({ ...productAttrs, producer: user });
		return await this.repo.save(packageItem);
	}
	// create one
	async updateOne(id: number, { level, status, ...updatedAttrs }: Partial<CreateUpdatePackageDto>, req: Request): Promise<Packages> {
		const packageItem = await this.findOne({ id });
		if (this.checkLevel(req)) {
			Object.assign(updatedAttrs, packageItem, { level, status });
		} else {
			Object.assign(updatedAttrs, packageItem);
		}
		if (this.checkCreator(req, packageItem.producer.id) || this.checkLevel(req)) {
			return await this.repo.save(updatedAttrs);
		} else {
			throw new UnauthorizedException("4012");
		}
	}
	// delete one
	async deleteOne(id: number, req: Request): Promise<Packages> {
		const packageItem = await this.findOne({ id });
		if (this.checkCreator(req, packageItem.producer.id) || this.checkLevel(req)) {
			return await this.repo.remove(packageItem);
		} else {
			throw new UnauthorizedException("4012");
		}
	}
	// *** handles
	queryIdHandler(arrayQuery: typeof ArrayContains.arguments) {
		const object = {};
		_map(arrayQuery, (value: string | string[], key: string) => {
			if (value?.length) {
				object[key] = ArrayContains(Array.isArray(value) ? value : [value]);
			}
		});
		return object;
	}
	queryContentHandler(arrayQuery: typeof Like.arguments) {
		const object = {};
		_map(arrayQuery, (value: string, key: string) => {
			if (value?.length) {
				object[key] = Like(`%${value}%`);
			}
		});
		return object;
	}
	checkLevel({ user }: Pick<Request, "user">) {
		const { role } = user;
		return [Role.Admin, Role.Editor].includes(role);
	}
	checkCreator({ user: { id } }: Pick<Request, "user">, creatorUserId: number) {
		return creatorUserId === id;
	}
	async duplicatedProductName({ faName, enName }: Partial<CreateUpdatePackageDto>) {
		return !!((await this.findOne({ faName }, true)) || (await this.findOne({ enName }, true)));
	}
}
