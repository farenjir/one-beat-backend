import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

type AllowedTypes = string | boolean | number | Array<any> | object;

interface IOptions {
	optional: boolean;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	constructor(private options?: IOptions) {}
	// transform
	async transform(value: any, { metatype }: ArgumentMetadata) {
		const { optional } = this.options || {};
		if (optional) return value || null;
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToInstance(metatype, value);
		const errors = await validate(object);
		if (errors.length > 0) {
			throw new BadRequestException("Validation failed");
		}
		// return
		return value;
	}
	// toValidate
	private toValidate(metatype: AllowedTypes): boolean {
		const types: AllowedTypes[] = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}
}
