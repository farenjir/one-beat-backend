import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { Types } from "./type.entity";

export { TypeDto, CreateTypeDto, UpdateTypeDto };

class TypeDto {
	@ApiProperty({ default: "code" })
	@Expose()
	code: string;
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "name" })
	@Expose()
	name: string;
	@ApiProperty({ default: "title" })
	@Expose()
	title: string;
	// TreeChildren
	@ApiProperty({ type: [Types] })
	@Expose()
	children: Types[];
}

class CreateTypeDto {
	@ApiProperty({ default: "code" })
	@IsString()
	code: string;
	@ApiProperty({ default: "name" })
	@IsString()
	@IsOptional()
	name?: string;
	@ApiProperty({ default: "title" })
	@IsString()
	@IsOptional()
	title?: string;
	@ApiProperty({ type: [Types] })
	@IsArray()
	children: Types[];
}

class UpdateTypeDto {
	@ApiProperty({ default: "code" })
	@IsString()
	code: string;
	@ApiProperty({ default: "name" })
	@IsString()
	@IsOptional()
	name?: string;
	@ApiProperty({ default: "title" })
	@IsString()
	@IsOptional()
	title?: string;
	@ApiProperty({ type: [Types] })
	@IsArray()
	children: Types[];
}
