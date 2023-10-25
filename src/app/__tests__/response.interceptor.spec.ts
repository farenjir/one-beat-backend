import { Reflector } from "@nestjs/core";
import { CallHandler, ExecutionContext } from "@nestjs/common";

import { Observable, of } from "rxjs";

import { AppResponseInterceptor } from "../app.interceptor";
import { AppResponseDto } from "utils/filters/response.filter";


describe("AppResponseInterceptor", () => {
	let interceptor: AppResponseInterceptor<any>;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		interceptor = new AppResponseInterceptor(reflector);
	});

	it("should return data with custom response message if RESPONSE_KEY is defined in the handler", (done) => {
		const mockResponseMessageCode = "2000";

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

		reflector.get = jest.fn(() => mockResponseMessageCode);

		const result$ = interceptor.intercept(mockContext, mockHandler) as Observable<AppResponseDto<any>>;

		result$.subscribe((result) => {
			expect(result).toBeDefined();
			expect(result.result).toEqual("response data"); // return response data
			expect(result.message).toEqual("succeed"); // response message
			expect(result.description).toEqual("succeed"); // description message
		});

		done();
	});
});
