import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";

import { CacheInterceptor } from "@nestjs/cache-manager";

import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout, tap } from "rxjs/operators";

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

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		// console.log("Before...", context.[_events]);

		const now = Date.now();
		return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
	}
}
