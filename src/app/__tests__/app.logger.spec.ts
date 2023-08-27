import { AppLoggingInterceptor } from "app/app.interceptor";

describe("AppLoggingInterceptor", () => {
	let interceptor: AppLoggingInterceptor;

	beforeEach(() => {
		interceptor = new AppLoggingInterceptor();
	});

	describe("setUserPrefix", () => {
		it("should set the user prefix correctly", () => {
			const prefix = "ExampleApp";
			interceptor.setUserPrefix(prefix);
			expect(interceptor["userPrefix"]).toBe(`${prefix} - `);
		});
	});

	describe("intercept", () => {
		it("should log the incoming request and return the result", () => {
			const context = {} as any; // mock ExecutionContext
			const call$ = {} as any; // mock CallHandler

			interceptor["logger"].log = jest.fn(); // spy on the log method
			call$.handle = jest.fn().mockReturnValueOnce({ pipe: jest.fn() }); // mock call$.handle()

			const result = interceptor.intercept(context, call$);

			expect(result).toBeDefined();
			expect(interceptor["logger"].log).toBeCalledWith(
				expect.objectContaining({ message: expect.any(String) }),
				expect.any(String),
			);
		});
	});
});
