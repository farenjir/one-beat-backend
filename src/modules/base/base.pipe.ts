import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

import { BaseQueries } from "./base.dto";

type AllowedTypes = string | boolean | number | Array<any> | object;

@Injectable()
export class ValidationQueryPipe implements PipeTransform<any> {
	// transform
	async transform(value: BaseQueries, { metatype }: ArgumentMetadata) {
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
