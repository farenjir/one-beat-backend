import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

export function Serialize(dto: ClassConstructor): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor<any>) {}
	// intercept
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler
			.handle()
			.pipe(rxMap((data: any) => plainToClass(this.dto, data, { excludeExtraneousValues: true })));
	}
}
