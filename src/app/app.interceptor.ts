import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";

import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

import { CacheInterceptor } from "@nestjs/cache-manager";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
	private readonly excludePaths: Array<string> = ["user", "upload"];
	// trackBy
	trackBy(context: ExecutionContext): string | undefined {
		const request = context.switchToHttp().getRequest();
		const { httpAdapter } = this.httpAdapterHost;
		// info
		const path = httpAdapter.getRequestUrl(request);
		const method = httpAdapter.getRequestMethod(request);
		// check conditions
		const isNotGetRequest = method !== "GET";
		const excludePath = this.excludePaths.some((ex) => path.includes(ex));
		// return
		if (excludePath || isNotGetRequest) {
			return undefined;
		} else {
			return httpAdapter.getRequestUrl(request);
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
