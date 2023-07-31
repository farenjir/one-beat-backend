import { NotFoundException, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user.entity";
import { UserDto } from "../user.dto";
import { AuthService, hashPassword } from "../users.auth.service";
import { UsersService } from "../user.service";

describe("AuthService", () => {
	let service: AuthService;
	let usersServiceMock: Partial<UsersService>;
	let jwtServiceMock: Partial<JwtService>;
	let configServiceMock: Partial<ConfigService>;

	beforeEach(async () => {
		usersServiceMock = {
			findByEmail: jest.fn(),
			create: jest.fn(),
		};

		jwtServiceMock = {
			signAsync: jest.fn(),
		};

		configServiceMock = {
			get: jest.fn().mockReturnValue("secret-key"),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: usersServiceMock,
				},
				{
					provide: JwtService,
					useValue: jwtServiceMock,
				},
				{
					provide: ConfigService,
					useValue: configServiceMock,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	describe("signup", () => {
		it("should throw BadRequestException if email is already in use", async () => {
			const email = "test@example.com";
			const password = "password";

			jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValue({ id: 1, email, password } as User);

			await expect(service.signup(email, password)).rejects.toThrow(BadRequestException);
			expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(email);
		});

		it("should create a new user and return the user object", async () => {
			const email = "test@example.com";
			const password = "password";
			const salt = "salt";
			const hashedPassword = "hashed-password";

			jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValue(null);
			jest.spyOn(usersServiceMock, "create").mockResolvedValue({ id: 1, email, password }as User);
			// jest.spyOn(global.crypto, "randomBytes").mockReturnValue({ toString: jest.fn().mockReturnValue(salt) });
			// jest.spyOn(service, "hashPassword").mockResolvedValue(hashedPassword);

			const result = await service.signup(email, password);

			expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(email);
			expect(usersServiceMock.create).toHaveBeenCalledWith(email, `${salt}.${hashedPassword}`);
			expect(result).toEqual({ id: 1, email, password });
		});
	});

	describe("signin", () => {
		it("should throw NotFoundException if user is not found", async () => {
			const email = "test@example.com";
			const password = "password";

			jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValue(null);

			await expect(service.signin(email, password)).rejects.toThrow(NotFoundException);
			expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(email);
		});

		it("should throw UnauthorizedException if password is invalid", async () => {
			const email = "test@example.com";
			const password = "password";
			const salt = "salt";
			const storedHash = "stored-hash";
			const invalidHash = "invalid-hash";

			jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValue({
				id: 1,
				email,
				password: `${salt}.${storedHash}`,
			}as User);
			// jest.spyOn(service, "hashPassword").mockResolvedValue(invalidHash);

			await expect(service.signin(email, password)).rejects.toThrow(UnauthorizedException);
			expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(email);
		});

		it("should return user object with JWT token if signin is successful", async () => {
			const email = "test@example.com";
			const password = "password";
			const salt = "salt";
			const storedHash = "stored-hash";
			const jwtToken = "jwt-token";

			jest.spyOn(usersServiceMock, "findByEmail").mockResolvedValue({
				id: 1,
				email,
				password: `${salt}.${storedHash}`,
			}as User);
			// jest.spyOn(service, "hashPassword").mockResolvedValue(storedHash);
			jest.spyOn(jwtServiceMock, "signAsync").mockResolvedValue(jwtToken);

			const result = await service.signin(email, password);

			expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(email);
			// expect(service.hashPassword).toHaveBeenCalledWith(password, salt);
			expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
				{ id: 1, email, roles: undefined },
				{ secret: "secret-key" },
			);
			expect(result).toEqual({ token: jwtToken, id: 1, email });
		});
	});

});
