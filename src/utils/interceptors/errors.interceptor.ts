import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	BadGatewayException,
	CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	intercept(
		_context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		return next.handle().pipe(catchError((_error) => throwError(() => new BadGatewayException())));
	}
}
