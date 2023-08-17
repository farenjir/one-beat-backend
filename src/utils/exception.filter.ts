import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

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
			code = exception.message;
			message = filterMessages(code);
		} else {
			statusCode = 500;
			code = 500;
			message = filterMessages(statusCode);
		}
		// responseBody
		const responseBody = {
			statusCode,
			code: Number(code) || statusCode,
			message,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};
		// return response
		httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
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
	return messages[stringCode] || stringCode || messages.default;
};
