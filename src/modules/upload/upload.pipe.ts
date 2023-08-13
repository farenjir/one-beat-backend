import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { ItemUploadType } from "./upload.configs";
import { UploadQueryDto } from "./upload.dto";

type AllowedTypes = string | boolean | number | Array<any> | object;
@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(public readonly optionsAsArray: ItemUploadType) {}
	// transform
	transform(value: any): Promise<any> {
		const { types, maxFileSize } = this.optionsAsArray;
		if (!value) {
			throw new BadRequestException("4005");
		}
		const { size, mimetype } = value;
		// validations
		if (!types.includes(mimetype)) {
			throw new BadRequestException("4006");
		}
		if (maxFileSize && size > maxFileSize) {
			throw new BadRequestException("4007");
		}
		// return
		return Promise.resolve(value);
	}
}

@Injectable()
export class ValidationQueryPipe implements PipeTransform<any> {
	// transform
	async transform(value: UploadQueryDto, { metatype }: ArgumentMetadata) {
		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToInstance(metatype, value);
		const errors = await validate(object);
		if (errors?.length) {
			throw new BadRequestException("4000");
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
