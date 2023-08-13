import { IsInt, IsOptional, IsString } from "class-validator";
import { Uploads } from "./upload.configs";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export { UploadDto, FileDto, UploadQueryDto };
class UploadDto {
	@ApiProperty()
	@Expose()
	@IsString()
	category: Uploads;
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

class UploadQueryDto {
	@IsString()
	@IsOptional()
	userId?: number;
	@IsString()
	@IsOptional()
	type?: string;
	@IsString()
	@IsOptional()
	category?: string;
}
