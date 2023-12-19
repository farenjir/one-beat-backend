import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length, MaxLength } from "class-validator";
import { Expose } from "class-transformer";

import { UploadEnum } from "utils/configs/upload.configs";

export { UploadDto, FileDto, UploadQueryDto, UploadResponseDto };

class UploadDto {
	@ApiProperty()
	@Expose()
	@IsInt()
	id: number;
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
	@Length(4, 24)
	type: string;
	@ApiProperty()
	@Expose()
	@IsString()
	@IsOptional()
	@MaxLength(200)
	description?: string;
}

class UploadQueryDto {
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@IsString()
	userId?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	type?: string;
	@ApiProperty({ name: "category", enum: UploadEnum, required: false })
	@IsOptional()
	@IsString()
	category?: UploadEnum;
}

class UploadResponseDto {
	@ApiProperty()
	@Expose()
	@IsInt()
	id: number;
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
