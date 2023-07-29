import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		// conso.log("Before...");
		// per action
		const now = Date.now();
		// return
		// return next.handle().pipe(tap(() => conso.log(`After... ${Date.now() - now}ms`)));
		return next.handle().pipe(tap(() => "something !"));
	}
}
