import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	RequestTimeoutException,
	Logger,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Request, Response } from "express";

import { CacheInterceptor } from "@nestjs/cache-manager";
import { plainToClass } from "class-transformer";

import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout, tap, map as rxMap } from "rxjs/operators";

import { ResponseKey } from "global/response.decorator";
import { SerializeKey } from "global/serialize.decorator";

import { appResponse, AppResponseDto } from "utils/response.filter";

export interface IClassConstructor<T = any> {
	new (...args: any[]): T;
}
export interface ISerialize {
	dto: IClassConstructor | null;
	exclude?: boolean;
}

@Injectable()
export class AppResponseInterceptor<T> implements NestInterceptor<T, AppResponseDto<T>> {
	constructor(private reflector: Reflector) {}
	// intercept
	intercept(context: ExecutionContext, next: CallHandler): Observable<AppResponseDto<T>> {
		const responseMessage = this.reflector.get<string>(ResponseKey, context.getHandler()) || "2000";
		// return
		return next.handle().pipe(
			rxMap((data) => {
				return appResponse(data, responseMessage);
			}),
		);
	}
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}
	// intercept
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		const { dto, exclude = false } = this.reflector.get<ISerialize>(SerializeKey, context.getClass()) || {};
		return handler.handle().pipe(
			rxMap((data) => {
				return plainToClass(dto, data, { excludeExtraneousValues: exclude });
			}),
		);
	}
}

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
	private readonly includePaths: Array<string> = ["base", "version"];
	// trackBy
	trackBy(context: ExecutionContext): string | undefined {
		const request = context.switchToHttp().getRequest();
		const { httpAdapter } = this.httpAdapterHost;
		// info
		const path = httpAdapter.getRequestUrl(request);
		const method = httpAdapter.getRequestMethod(request);
		// check conditions
		const isGetRequest = method === "GET";
		const includePath = this.includePaths.some((ex) => path.includes(ex));
		// return
		if (includePath && isGetRequest) {
			return httpAdapter.getRequestUrl(request);
		} else {
			return undefined;
		}
	}
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
	// intercept
	intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			timeout(5000),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					return throwError(() => new RequestTimeoutException());
				}
				return throwError(() => err);
			}),
		);
	}
}

@Injectable()
// This is structure of ( @nestjs-logging-interceptor ) !
export class AppLoggingInterceptor implements NestInterceptor {
	private readonly ctxPrefix: string = AppLoggingInterceptor.name;
	private readonly logger: Logger = new Logger(this.ctxPrefix);
	// setUserPrefix
	private userPrefix: string = "";
	public setUserPrefix(prefix: string): void {
		this.userPrefix = `${prefix} - `;
	}
	// intercept
	public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
		const req: Request = context.switchToHttp().getRequest();
		const { method, url, body, headers, user } = req;
		const userId = `userId${user.id || 0}`;
		const ctx: string = `${this.userPrefix}${this.ctxPrefix} - ${method} - ${url} - ${userId}`;
		const message: string = `Incoming request - ${method} - ${url} - ${userId}`;
		// logging
		this.logger.log({ message, method, body, headers, user }, ctx);
		// return
		return call$.handle().pipe(
			tap({
				next: (val: unknown): void => this.logNext(val, req),
				error: (err: Error): void => this.logError(err, req),
			}),
		);
	}
	// *** handles
	private logNext(body: unknown, req: Request): void {
		const { method, url, user } = req;
		const userId = `userId${user.id || 0}`;
		const statusCode: number = req.res.statusCode;
		const ctx: string = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url} - ${userId}`;
		const message: string = `Outgoing response - ${statusCode} - ${method} - ${url} - ${userId}`;
		// logging
		this.logger.log({ message, body, user }, ctx);
	}
	private logError(error: Error, req: Request): void {
		const { method, url, body, user } = req;
		const userId = `userId${user.id || 0}`;
		if (error instanceof HttpException) {
			const statusCode: number = error.getStatus();
			const ctx: string = `${this.userPrefix}${this.ctxPrefix} - ${statusCode} - ${method} - ${url} - ${userId}`;
			const message: string = `Outgoing response - ${statusCode} - ${method} - ${url} - ${userId}`;
			// logging
			if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
				this.logger.error({ method, url, body, message, error, user }, error.stack, ctx);
			} else {
				this.logger.warn({ method, url, error, body, message, user }, ctx);
			}
		} else {
			// logging
			this.logger.error(
				{ message: `Outgoing response - ${method} - ${url} - ${userId}`, user },
				error.stack,
				`${this.userPrefix}${this.ctxPrefix} - ${method} - ${url} - ${userId}`,
			);
		}
	}
}
