import { NotFoundException, BadRequestException } from "@nestjs/common";
import { Repository } from "typeorm";

import { Role } from "global/guards.decorator";

import { Users } from "../user.entity";
import { UsersService } from "../users.service";
import { CreateSaveUserDto } from "../user.dto";

import { UserKYC } from "../kyc/kyc.entity";
import { UserKycService } from "../kyc/kyc.service";

import { Profile } from "../profile/profile.entity";
import { ProfileService } from "../profile/profile.service";

describe("UsersService", () => {
	let usersService: UsersService;
	let repo: Repository<Users>;
	let profileService: ProfileService;
	let kycService: UserKycService;

	beforeEach(() => {
		// Mock the dependencies
		repo = {} as Repository<Users>;
		profileService = {} as ProfileService;
		kycService = {} as UserKycService;
		// usersService
		usersService = new UsersService(repo, profileService, kycService);
	});

	describe("create", () => {
		it("should create a user and return the created user", async () => {
			// Arrange
			const createUser: CreateSaveUserDto = {
				username: "farshid",
				email: "farshid@example.com",
				password: "P@ssword",
			};
			const expectedUser: Users = {
				id: 1,
				role: Role.User,
				profile: new Profile(),
				kyc: new UserKYC(),
				createdAt: undefined,
				updatedAt: undefined,
				deletedAt: undefined,
				username: "",
				email: "",
				password: "",
			};
			// spyOn
			jest.spyOn(repo, "save").mockResolvedValue(expectedUser);
			// Act
			const result = await usersService.create(createUser);
			// Assert
			expect(kycService.create).toHaveBeenCalledWith({ userKyc: true });
			expect(repo.create).toHaveBeenCalledWith({ ...createUser, profile: {}, kyc: {} });
			expect(repo.save).toHaveBeenCalledWith(expectedUser);
			expect(result).toEqual(expectedUser);
		});
	});

	describe("findUsers", () => {
		it("should return an array of users", async () => {
			// Arrange
			const expectedUsers: Users[] = [
				{
					id: 1,
					username: "farshid",
					email: "farshid@gmail.com",
					password: "P@ssword123",
					role: Role.User,
					profile: new Profile(),
					kyc: new UserKYC(),
					createdAt: undefined,
					updatedAt: undefined,
					deletedAt: undefined,
				},
			];
			// spyOn
			jest.spyOn(repo, "find").mockResolvedValue(expectedUsers);
			// Act
			const result = await usersService.findUsers({});
			// Assert
			expect(repo.find).toHaveBeenCalled();
			expect(result).toEqual(expectedUsers);
		});
	});

	describe("findBy", () => {
		it("should find a user by id and return the user", async () => {
			// Arrange
			const query = { id: 1 };
			const expectedUser: Users = {
				id: 1,
				username: "farshid",
				email: "",
				password: "",
				role: Role.User,
				profile: new Profile(),
				kyc: new UserKYC(),
				createdAt: undefined,
				updatedAt: undefined,
				deletedAt: undefined,
			};
			jest.spyOn(repo, "findOne").mockResolvedValue(expectedUser);
			// Act
			const result = await usersService.findBy(query);
			// Assert
			expect(repo.findOne).toHaveBeenCalledWith({ where: { id: query.id } });
			expect(result).toEqual(expectedUser);
		});

		it("should throw BadRequestException if no valid parameters are provided", async () => {
			// Arrange
			const query = {};
			// Act & Assert
			await expect(usersService.findBy(query)).rejects.toThrowError(BadRequestException);
		});

		it("should throw NotFoundException if checkValidUser is true and no user is found", async () => {
			// Arrange
			const query = {};
			// Act & Assert
			await expect(usersService.findBy(query, true)).rejects.toThrowError(NotFoundException);
		});
	});
});
