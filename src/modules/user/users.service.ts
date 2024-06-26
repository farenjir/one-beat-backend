import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Like, Repository } from "typeorm";

import { pickBy as _pickBy, isEmpty as _isEmpty, map as _map } from "lodash";

import { handleHashPassword, hashPassword } from "modules/auth/auth.configs";

import { ProfileService } from "./profile/profile.service";
import { UserKycService } from "./kyc/kyc.service";

import { Users } from "./user.entity";
import { CreateSaveUserDto, UpdateProfileDto, UserProfileDto, UserQuery, UsersQuery } from "./user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users) private repo: Repository<Users>,
		private profileService: ProfileService,
		private kycService: UserKycService,
	) {}
	// findAll
	async findUsers({
		page = 1,
		take = 10,
		email,
		username,
		// kyc
		userKyc,
		emailKyc,
		googleKyc,
		mobileKyc,
		producerKyc,
		...queryParams
	}: UsersQuery): Promise<[Users[], number]> {
		const kyc = { userKyc, emailKyc, googleKyc, mobileKyc, producerKyc };
		// options
		const options: FindManyOptions<Users> = {
			order: { id: "DESC" },
			skip: page - 1,
			take,
			where: { kyc, ...this.queryContentHandler({ username, email }), ...queryParams },
		};
		return await this.repo.findAndCount(options);
	}
	// findOne
	async findOne({ id, email, username }: UserQuery, checkValidUser = false, withRelation = false): Promise<Users> {
		const options: FindOneOptions<Users> = {
			where: _pickBy<object>({ id, email, username }, (isTruthy: unknown) => isTruthy),
			relations: {
				profile: withRelation,
			},
		};
		if (_isEmpty(options.where)) {
			throw new BadRequestException("4000");
		}
		const user = await this.repo.findOne(options);
		if (checkValidUser && !user) {
			throw new NotFoundException("4001");
		}
		return user;
	}
	// createOne
	async create(params: CreateSaveUserDto, authWithGoogle: boolean = false): Promise<Users> {
		const kyc = await this.kycService.create({
			userKyc: authWithGoogle,
			emailKyc: authWithGoogle,
			googleKyc: authWithGoogle,
		});
		// create
		const user = this.repo.create({ ...params, profile: {}, kyc });
		return this.repo.save(user);
	}
	// update
	async updateById(id: number, { profile, username, email, password, role, kyc }: Partial<UserProfileDto>): Promise<Users> {
		const user = await this.findOne({ id }, true, true);
		const profileId = user?.profile?.id;
		const kycId = user?.kyc?.id;
		// profile
		const createOrUpdated = profile ? await this.profileService.createOrUpdate(profileId, profile) : null;
		// hashedPassword
		const hashedPassword = password ? await hashPassword(password) : null;
		// updateKyc
		const kycUpdated = kyc ? await this.kycService.updateById(kycId, kyc) : null;
		// relations
		const updatedData = _pickBy<object>(
			{ password: hashedPassword, email, username, profile: createOrUpdated, kyc: kycUpdated, role },
			(isTruthy: unknown) => isTruthy,
		);
		// updateUserData
		Object.assign(user, updatedData);
		return await this.repo.save(user);
	}
	// update with profile
	async updateUserProfile(
		id: number,
		{ profile, username, email, password, currentPassword }: Partial<UpdateProfileDto>,
	): Promise<Users> {
		const user = await this.findOne({ id }, true, true);
		const profileId = user?.profile?.id;
		// profile
		const createOrUpdated = profile ? await this.profileService.createOrUpdate(profileId, profile) : null;
		// stored password
		let hashedPassword = null;
		if (password && currentPassword) {
			const [salt, storedHash] = user.password.split(".");
			const hash = await handleHashPassword(currentPassword, salt);
			// check password
			if (storedHash !== hash) {
				throw new BadRequestException("2018");
			}
			hashedPassword = await hashPassword(password);
		} else {
			throw new BadRequestException("2018");
		}
		// relations
		const updatedData = _pickBy<object>(
			{ password: hashedPassword, email, username, profile: createOrUpdated },
			(isTruthy: unknown) => isTruthy,
		);
		// updateUserData
		Object.assign(user, updatedData);
		return await this.repo.save(user);
	}
	// remove
	async removeById(id: number): Promise<Users> {
		const user = await this.findOne({ id }, true);
		return await this.repo.remove(user);
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
