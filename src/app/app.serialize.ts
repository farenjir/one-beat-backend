import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToClass } from "class-transformer";

import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

class SerializeInterceptor implements NestInterceptor {
	constructor(
		private dto: ClassConstructor<any>,
		private inCludes: boolean = true,
	) {}
	// intercept
	intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			rxMap(({ data, ...other }) => ({
				...other,
				data: plainToClass(this.dto, data, { excludeExtraneousValues: this.inCludes }),
			})),
		);
	}
}

export function Serialize(dto: ClassConstructor, inCludes?: boolean): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(new SerializeInterceptor(dto, inCludes));
}
