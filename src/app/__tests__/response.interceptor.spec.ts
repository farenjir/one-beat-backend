import { Reflector } from "@nestjs/core";
import { CallHandler, ExecutionContext } from "@nestjs/common";

import { Observable, of } from "rxjs";

import { AppResponseInterceptor } from "../app.interceptor";

import { AppResponseDto } from "utils/response.filter";

describe("AppResponseInterceptor", () => {
	let interceptor: AppResponseInterceptor<any>;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		interceptor = new AppResponseInterceptor(reflector);
	});

	it("should return data with custom response message if ResponseKey is defined in the handler", (done) => {
		const mockResponseMessage = "Custom response message";

		const mockHandler: CallHandler<any> = {
			handle: () => of("response data"),
		};
		const mockContext: ExecutionContext = {
			getHandler: jest.fn(() => ({
				name: "handlerName",
				parent: {},
				instance: {},
				callback: null,
				bind: null,
			})),
		} as any;

		reflector.get = jest.fn(() => mockResponseMessage);

		const result$ = interceptor.intercept(mockContext, mockHandler) as Observable<AppResponseDto<any>>;

		result$.subscribe((result) => {
			expect(result).toBeDefined();
			expect(result.result).toEqual("response data"); // return response data
			expect(result.message).toEqual(mockResponseMessage); // return response data
		});

		done();
	});
});
