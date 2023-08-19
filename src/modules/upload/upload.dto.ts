import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { UploadEnum } from "./upload.configs";

export { UploadDto, FileDto, UploadQueryDto, UploadResponseDto };

class UploadDto {
	@ApiProperty({ name: "category", enumName: "UploadEnum", enum: UploadEnum })
	@Expose()
	@IsString()
	category: UploadEnum;
	@ApiProperty()
	@Expose()
	@IsString()
	type: string;
	@ApiProperty()
	@Expose()
	@IsString()
	@IsOptional()
	description?: string;
}

class UploadQueryDto {
	@IsString()
	@IsOptional()
	userId?: number;
	@IsString()
	@IsOptional()
	type?: string;
	@IsString()
	@IsOptional()
	category?: UploadEnum;
}

class UploadResponseDto {
	@ApiProperty()
	@Expose()
	@IsString()
	id: string;
	@ApiProperty()
	@Expose()
	@IsInt()
	userId: number;
	@ApiProperty()
	@Expose()
	@IsString()
	name: string;
	@ApiProperty({ name: "category", enumName: "UploadEnum", enum: UploadEnum })
	@Expose()
	@IsString()
	category: UploadEnum;
	@ApiProperty()
	@Expose()
	@IsString()
	type: string;
	@ApiProperty()
	@Expose()
	@IsString()
	description?: string;
	@ApiProperty()
	@Expose()
	createdAt: Date;
	@ApiProperty()
	@Expose()
	updatedAt: Date;
	@ApiProperty()
	@Expose()
	deletedAt: Date;
}

class FileDto {
	@IsString()
	fieldname: string;
	@IsString()
	originalname: string;
	@IsString()
	encoding: string;
	@IsString()
	mimetype: string;
	@IsString()
	destination: string;
	@IsString()
	filename: string;
	@IsString()
	path: string;
	@IsInt()
	size: number;
}
