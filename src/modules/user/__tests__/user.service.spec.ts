// import { Test, TestingModule } from "@nestjs/testing";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Repository } from "typeorm";

// import { Users } from "../user.entity";
// import { UsersService } from "../user.service";
// import { CreateSaveUserDto } from "../user.dto";

// import { Profile } from "../profile/profile.entity";
// import { ProfileService } from "../profile/profile.service";

// import { UserKYC } from "../kyc/kyc.entity";
// import { UserKycService } from "../kyc/kyc.service";

// describe("UsersService", () => {
// 	let repository: Repository<Users>;
// 	let service: UsersService;
// 	let profileService: ProfileService;
// 	let kycService: UserKycService;
// 	// *** beforeEach
// 	beforeEach(async () => {
// 		const module: TestingModule = await Test.createTestingModule({
// 			providers: [
// 				UsersService,
// 				ProfileService,
// 				UserKycService,
// 				{
// 					provide: getRepositoryToken(Users),
// 					useClass: Repository,
// 				},
// 			],
// 		}).compile();
// 		// modules
// 		repository = module.get<Repository<Users>>(getRepositoryToken(Users));
// 		service = module.get<UsersService>(UsersService);
// 		profileService = module.get<ProfileService>(ProfileService);
// 		kycService = module.get<UserKycService>(UserKycService);
// 	});
// 	// *** afterEach
// 	afterEach(() => {
// 		jest.resetAllMocks();
// 	});
// 	// create
// 	describe("create", () => {
// 		it("should create a new user with kyc", async () => {
// 			// Arrange
// 			const dto: CreateSaveUserDto = {
// 				username: "",
// 				email: "",
// 				password: "",
// 			};
// 			const expectedUser: Users = {
// 				id: 0,
// 				username: "",
// 				email: "",
// 				password: "",
// 				roles: [],
// 				profile: new Profile(),
// 				kyc: new UserKYC(),
// 				createdAt: undefined,
// 				updatedAt: undefined,
// 				deletedAt: undefined,
// 			};
// 			jest.spyOn(kycService, "create").mockResolvedValue({
// 				id: 1,
// 				userKyc: true,
// 				mobileKyc: false,
// 				emailKyc: false,
// 				producerKyc: false,
// 			});

// 			// Act
// 			const result = await service.create(dto);

// 			// Assert
// 			expect(repository.create).toHaveBeenCalledWith({ ...dto, profile: {}, kyc: { id: 1 } });
// 			expect(repository.save).toHaveBeenCalledWith(expectedUser);
// 			expect(result).toEqual(expectedUser);
// 		});
// 	});
// 	// findUsers
// 	describe("findUsers", () => {
// 		it("should return all users", async () => {
// 			// Arrange
// 			const expectedUsers: Users[] = [
// 				/* Expected user objects here */
// 			];
// 			jest.spyOn(repository, "find").mockResolvedValue(expectedUsers);

// 			// Act
// 			const result = await service.findUsers();

// 			// Assert
// 			expect(result).toEqual(expectedUsers);
// 		});
// 	});
// });
