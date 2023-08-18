import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";

import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

import { CacheInterceptor } from "@nestjs/cache-manager";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
	private readonly includePaths: Array<string> = ["base"];
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
