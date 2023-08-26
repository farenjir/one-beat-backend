import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";

import { Request, Response } from "express";
import { get } from "lodash";

import { getCode, getErrorMessage } from "./exception.error";

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
	private readonly logger: Logger = new Logger(AppExceptionsFilter.name);
	// catch
	public catch(exception: any, host: ArgumentsHost): void {
		const ctx: HttpArgumentsHost = host.switchToHttp();
		const request: Request = ctx.getRequest();
		const response: Response = ctx.getResponse();
		// options
		let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
		let code: string = HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
		let message: string = "An internal server error occurred";
		let exceptionStack: string = "";
		// exception
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			code = getCode(exception.getResponse());
			message = getErrorMessage(exception.getResponse());
			exceptionStack = "stack" in exception ? exception.stack : "";
		} else if (get(exception, "type") === "entity.too.large") {
			status = HttpStatus.PAYLOAD_TOO_LARGE;
			code = HttpStatus[HttpStatus.PAYLOAD_TOO_LARGE];
			message = `
							Your request entity size is too big for the server to process it:
									- request size: ${get(exception, "length")};
									- request limit: ${get(exception, "limit")}.`;
		}
		// error and warning
		if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
			this.logger.error(
				{
					message: `${status} [${request.method} ${request.url}] has thrown a critical error`,
					headers: request.headers,
				},
				exceptionStack,
			);
		} else if (status >= HttpStatus.BAD_REQUEST) {
			this.logger.warn({
				message: `${status} [${request.method} ${request.url}] has thrown an HTTP client error`,
				exceptionStack,
				headers: request.headers,
			});
		}
		// return response
		response.status(status).send({
			status,
			code,
			message: filterMessages(message) || message,
			appCode: Number(message),
			timestamp: new Date().toISOString(),
			method: request.method,
			path: request.url,
		});
	}
}

const filterMessages = (stringCode: string | number) => {
	const messages = {
		// custom codes
		4000: "Invalid Query or Params",
		4001: "User Not Found",
		4002: "Email is Already in Use",
		4003: "Invalid Password or Email",
		4004: "Base Not Found",
		4005: "File Not Found",
		4006: "File type not support",
		4007: "File size exceeds the allowed limit",
		4008: "Parent not Found",
		4009: "Version not Found",
		4010: "User Kyc not Found",
		// default status http codes
		100: "CONTINUE",
		101: "SWITCHING_PROTOCOLS",
		102: "PROCESSING",
		103: "EARLY_HINTS",
		200: "OK",
		201: "CREATED",
		202: "ACCEPTED",
		203: "NON_AUTHORITATIVE_INFORMATION",
		204: "NO_CONTENT",
		205: "RESET_CONTENT",
		206: "PARTIAL_CONTENT",
		300: "AMBIGUOUS",
		301: "MOVED_PERMANENTLY",
		302: "FOUND",
		303: "SEE_OTHER",
		304: "NOT_MODIFIED",
		307: "TEMPORARY_REDIRECT",
		308: "PERMANENT_REDIRECT",
		400: "BAD_REQUEST",
		401: "UNAUTHORIZED",
		402: "PAYMENT_REQUIRED",
		403: "FORBIDDEN",
		404: "NOT_FOUND",
		405: "METHOD_NOT_ALLOWED",
		406: "NOT_ACCEPTABLE",
		407: "PROXY_AUTHENTICATION_REQUIRED",
		408: "REQUEST_TIMEOUT",
		409: "CONFLICT",
		410: "GONE",
		411: "LENGTH_REQUIRED",
		412: "PRECONDITION_FAILED",
		413: "PAYLOAD_TOO_LARGE",
		414: "URI_TOO_LONG",
		415: "UNSUPPORTED_MEDIA_TYPE",
		416: "REQUESTED_RANGE_NOT_SATISFIABLE",
		417: "EXPECTATION_FAILED",
		418: "I_AM_A_TEAPOT",
		421: "MISDIRECTED",
		422: "UNPROCESSABLE_ENTITY",
		424: "FAILED_DEPENDENCY",
		428: "PRECONDITION_REQUIRED",
		429: "TOO_MANY_REQUESTS",
		500: "INTERNAL_SERVER_ERROR",
		501: "NOT_IMPLEMENTED",
		502: "BAD_GATEWAY",
		503: "SERVICE_UNAVAILABLE",
		504: "GATEWAY_TIMEOUT",
		505: "HTTP_VERSION_NOT_SUPPORTED",
		default: "Unknown_Server_Error",
	};
	// return
	return messages[stringCode] || messages.default;
};
