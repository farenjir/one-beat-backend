import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../user.entity";
import { UsersService } from "../user.service";

describe("UsersService", () => {
	let service: UsersService;
	let repoMock: Partial<Repository<any>>;

	beforeEach(async () => {
		repoMock = {
			create: jest.fn(),
			save: jest.fn(),
			find: jest.fn(),
			findOne: jest.fn(),
			remove: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: repoMock,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	describe("create", () => {
		it("should create a new user", async () => {
			const email = "test@example.com";
			const password = "password";
			const createdUser = { id: 1, email, password };

			jest.spyOn(repoMock, "create").mockReturnValue(createdUser);
			jest.spyOn(repoMock, "save").mockResolvedValue(createdUser);

			const result = await service.create(email, password);

			expect(repoMock.create).toHaveBeenCalledWith({ email, password });
			expect(repoMock.save).toHaveBeenCalledWith(createdUser);
			expect(result).toEqual(createdUser);
		});
	});
});
