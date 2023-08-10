import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor<any>, private inClude: boolean = true) {}
	// intercept
	intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler
			.handle()
			.pipe(rxMap((data: any) => plainToClass(this.dto, data, { excludeExtraneousValues: this.inClude })));
	}
}

export function Serialize(dto: ClassConstructor, inClude?: boolean): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(new SerializeInterceptor(dto, inClude));
}
