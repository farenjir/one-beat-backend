import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { plainToClass } from "class-transformer";

import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

@Injectable()
class SerializeInterceptor implements NestInterceptor {
	constructor(
		private dto: ClassConstructor<any>,
		private inCludes: boolean = true,
	) {}
	// intercept
	intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			rxMap(({ result, ...other }) => ({
				...other,
				result: plainToClass(this.dto, result, { excludeExtraneousValues: this.inCludes }),
			})),
		);
	}
}

export function Serialize(dto: ClassConstructor, inCludes?: boolean): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(new SerializeInterceptor(dto, inCludes));
}
