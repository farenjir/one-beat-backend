import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "../users.controller";
import { UsersService } from "../user.service";
import { AuthService } from "../users.auth.service";

describe("UsersController", () => {
	let controller: UsersController;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [UsersService, AuthService],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		usersService = module.get<UsersService>(UsersService);
	});

	describe("signIn", () => {
		it("should sign in a user and set the app-token cookie", async () => {
			const createUserDto = { email: "test@example.com", password: "password" };
			const userDto = { id: 1, email: "test@example.com", token: "token" };

			jest.spyOn(controller["authService"], "signin").mockResolvedValue(userDto);
			const resMock = { cookie: jest.fn() };

			const result = await controller.signIn(createUserDto, <any>resMock);

			expect(controller["authService"].signin).toHaveBeenCalledWith("test@example.com", "password");
			expect(resMock.cookie).toHaveBeenCalledWith("app-token", "token", expect.any(Object));
			expect(result).toEqual(userDto);
		});
	});

	// Add more test cases for other methods here...
});
