import { IsOptional, IsString } from "class-validator";
import { Uploads } from "./upload.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class FileDto {
	@ApiProperty()
	@Expose()
	@IsString()
	name: string;
	@ApiProperty()
	@Expose()
	@IsString()
	type: Uploads;
	@ApiProperty()
	@Expose()
	@IsString()
	@IsOptional()
	description?: string;
}
