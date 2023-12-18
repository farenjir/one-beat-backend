import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArrayContains, FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { Request } from "express";

import { pickBy as _pickBy, isEmpty as _isEmpty, map as _map } from "lodash";

import { Role } from "global/guards.decorator";
import { UsersService } from "modules/user/users.service";

import { Blogs } from "./blog.entity";
import { BlogQuery, CreateUpdateDto } from "./blog.dto";

@Injectable()
export class BlogServices {
	constructor(
		@InjectRepository(Blogs) private repo: Repository<Blogs>,
		private usersService: UsersService,
	) {}
	// find all
	async findAll({
		page = 1,
		take = 10,
		// user
		authorId,
		username,
		email,
		// array
		groupIds,
		tags,
		language,
		...queryParams
	}: BlogQuery): Promise<[Blogs[], number]> {
		// arrayQuery
		const bases = this.queryIdHandler({ groupIds });
		// options
		const options: FindManyOptions<Blogs> = {
			skip: page - 1,
			take,
			where: {
				author: { id: authorId, username, email },
				...queryParams,
				...bases,
			},
		};
		return await this.repo.findAndCount(options);
	}
	// find one
	async findOne(queryParams: Pick<BlogQuery, "id" | "enTitle" | "faTitle">, ignoreValidateProduct = false): Promise<Blogs> {
		const options: FindOneOptions<Blogs> = {
			where: _pickBy<object>(queryParams, (isTruthy: unknown) => isTruthy),
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const blog = await this.repo.findOne(options);
		if (blog || ignoreValidateProduct) {
			return blog;
		} else {
			throw new NotFoundException("4013");
		}
	}
	// create one
	async createOne({ level, status, ...blogAttrs }: CreateUpdateDto, req: Request): Promise<Blogs> {
		const isDuplicated = await this.duplicatedProductName(blogAttrs);
		if (isDuplicated) {
			throw new BadRequestException("4014");
		}
		const user = await this.usersService.findBy({ id: req?.user?.id }, true);
		if (this.checkLevel(req)) {
			Object.assign(blogAttrs, { level, status });
		}
		const blog = this.repo.create({ ...blogAttrs, author: user });
		return await this.repo.save(blog);
	}
	// create one
	async updateOne(
		id: number,
		{ level, status, ...updatedAttrs }: Partial<CreateUpdateDto>,
		{ user }: Pick<Request, "user">,
	): Promise<Blogs> {
		const blog = await this.findOne({ id });
		if (this.checkLevel({ user })) {
			Object.assign(updatedAttrs, blog, { level, status });
		} else {
			Object.assign(updatedAttrs, blog);
		}
		if (this.checkCreator({ user }, blog.author.id) || this.checkLevel({ user })) {
			return await this.repo.save(updatedAttrs);
		} else {
			throw new UnauthorizedException("4012");
		}
	}
	// delete one
	async deleteOne(id: number, { user }: Pick<Request, "user">): Promise<Blogs> {
		const blog = await this.findOne({ id });
		if (this.checkCreator({ user }, blog.author.id) || this.checkLevel({ user })) {
			return await this.repo.remove(blog);
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
	checkLevel({ user }: Pick<Request, "user">) {
		const { role } = user;
		return [Role.Admin, Role.Editor, Role.Producer, Role.Author].includes(role);
	}
	checkCreator({ user: { id } }: Pick<Request, "user">, creatorUserId: number) {
		return creatorUserId === id;
	}
	async duplicatedProductName({ faTitle, enTitle }: Partial<CreateUpdateDto>) {
		return !!((await this.findOne({ faTitle }, true)) || (await this.findOne({ enTitle }, true)));
	}
}
