import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { globalFilterMessages } from "utils/filter.message";

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
	// catch
	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const { httpAdapter } = this.httpAdapterHost;
		// variables
		let statusCode: number;
		let message: string;
		let code: string | number;
		// init variables
		if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
			code = exception.message || statusCode;
			message = globalFilterMessages(code);
		} else {
			statusCode = 500;
			code = 500;
			message = globalFilterMessages(statusCode);
		}
		// responseBody
		const responseBody = {
			code: Number(code),
			message, 
			statusCode,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};
		// return response
		httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
	}
}
