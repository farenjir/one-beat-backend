import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";

import { CacheInterceptor } from "@nestjs/cache-manager";

import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout, tap, map as rxMap } from "rxjs/operators";

import { Reflector } from "@nestjs/core";
import { plainToClass } from "class-transformer";

import { ResponseKey } from "global/response.decorator";
import { SerializeKey } from "global/serialize.decorator";

import { appResponse, AppResponseDto } from "utils/response.filter";

export interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}
export interface ISerialize {
	dto: ClassConstructor;
	exclude?: boolean;
}

@Injectable()
export class AppResponseInterceptor<T> implements NestInterceptor<T, AppResponseDto<T>> {
	constructor(private reflector: Reflector) {}
	// intercept
	intercept(context: ExecutionContext, next: CallHandler): Observable<AppResponseDto<T>> {
		const responseMessage = this.reflector.get<string>(ResponseKey, context.getHandler()) ?? "";
		// return
		return next.handle().pipe(rxMap((data) => appResponse(data, responseMessage)));
	}
}

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}
	// intercept
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		const { dto, exclude = false } = this.reflector.get<ISerialize>(SerializeKey, context.getHandler()) ?? {};
		return handler.handle().pipe(
			rxMap(({ result, ...other }) => ({
				...other,
				result: plainToClass(dto, result, { excludeExtraneousValues: exclude }),
			})),
		);
	}
}

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// console.log("Before...", context.[_events]);

		const now = Date.now();
		return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
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
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
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
