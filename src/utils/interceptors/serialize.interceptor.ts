import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToClass } from "class-transformer";

import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";

import { IResponse } from "utils/response.message";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor<any>, private inClude: boolean = true) {}
	// intercept
	intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			rxMap(({ data = {}, ...other }: IResponse) => ({
				...other,
				data: plainToClass(this.dto, data, { excludeExtraneousValues: this.inClude }),
			})),
		);
	}
}

export function Serialize(dto: ClassConstructor, inClude?: boolean): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(new SerializeInterceptor(dto, inClude));
}
