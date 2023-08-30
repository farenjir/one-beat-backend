import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Test, TestingModule } from "@nestjs/testing";

import { Observable, of } from "rxjs";

import { AppResponseInterceptor } from "../app.interceptor";

describe("AppResponseInterceptor", () => {
	let interceptor: AppResponseInterceptor<any>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AppResponseInterceptor,
				{
					provide: Reflector,
					useValue: { get: jest.fn() }, // Mock Reflector
				},
			],
		}).compile();

		interceptor = module.get<AppResponseInterceptor<any>>(AppResponseInterceptor);
	});

	describe("intercept", () => {
		it("should return the data wrapped in AppResponseDto", (done) => {
			const context = {
				getHandler: jest.fn(),
			} as unknown as ExecutionContext;
			const next = {
				handle: () =>
					of({
						// Mock data
						message: "Hello, World!",
					}),
			} as unknown as CallHandler<Observable<any>>;

			const expectedResponse = {
				data: { message: "Hello, World!" },
				message: "2000", // Default response message as it wasn't provided through decorator
			};

			interceptor.intercept(context, next).subscribe((result) => {
				expect(result).toEqual(expectedResponse);
				done();
			});
		});
	});
});
