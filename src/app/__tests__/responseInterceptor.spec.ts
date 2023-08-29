import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, CallHandler } from "@nestjs/common";

import { AppResponseInterceptor } from "../app.interceptor";

import { AppResponseDto } from "utils/response.filter";

describe("AppResponseInterceptor", () => {
	let interceptor: AppResponseInterceptor<any>;
	const reflectorMock = {
		get: jest.fn(),
	};
	const contextMock = {} as ExecutionContext;
	const handlerMock = {} as CallHandler;
	const dataMock = {};
	const responseMessageMock = "2000";

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AppResponseInterceptor, { provide: Reflector, useValue: reflectorMock }],
		}).compile();

		interceptor = module.get<AppResponseInterceptor<any>>(AppResponseInterceptor);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("intercept", () => {
		it("should return an Observable of AppResponseDto with the correct response message", (done) => {
			// Arrange
			reflectorMock.get.mockReturnValue(responseMessageMock);

			// Act
			const result$ = interceptor.intercept(contextMock, handlerMock);
			result$.subscribe((response) => {
				// Assert
				expect(response).toBeInstanceOf(AppResponseDto);
				expect(response.message).toBe(responseMessageMock);
				done();
			});
		});

		it("should return the original data if no response message is set", (done) => {
			// Arrange
			reflectorMock.get.mockReturnValue(undefined);

			// Act
			const result$ = interceptor.intercept(contextMock, handlerMock);
			result$.subscribe((response) => {
				// Assert
				expect(response).toBe(dataMock);
				done();
			});
		});
	});
});
