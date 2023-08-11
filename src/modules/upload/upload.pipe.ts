import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { ItemUploadType } from "./upload.enum";

@Injectable()
export class FileValidationPipe implements PipeTransform {
	constructor(public readonly optionsAsArray: ItemUploadType) {}
	// transform
	transform(value: any): Promise<any> {
		const { types, maxFileSize } = this.optionsAsArray;
		if (!value) {
			throw new BadRequestException("File not Found");
		}
		const { size, mimetype } = value;
		// validations
		if (!types.includes(mimetype)) {
			throw new BadRequestException("File type not support");
		}
		if (maxFileSize && size > maxFileSize) {
			throw new BadRequestException("File size exceeds the allowed limit");
		}
		// return
		return Promise.resolve(value);
	}
}
