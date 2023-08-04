import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export { BaseDto, CreateBaseDto, UpdateBaseDto };

class BaseDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "type" })
	@Expose()
	type: string;
	@ApiProperty({ default: "Name" })
	@Expose()
	name: string;
	@ApiProperty({ default: "NameFa" })
	@Expose()
	nameFa: string;
	@Expose()
	parent?: BaseDto;
	@ApiProperty({ default: [BaseDto] })
	@Expose()
	children: BaseDto[];
}

class CreateBaseDto {
	@ApiProperty({ default: 0 })
	@IsInt()
	parentId: number;
	@ApiProperty({ default: "type" })
	@IsString()
	type: string;
	@ApiProperty({ default: "Name" })
	@IsString()
	name: string;
	@ApiProperty({ default: "NameFa" })
	@IsString()
	nameFa: string;
}

class UpdateBaseDto {
	@ApiProperty({ default: 0 })
	@IsInt()
	parentId?: number;
	@ApiProperty({ default: "type" })
	@IsString()
	@IsOptional()
	type: string;
	@ApiProperty({ default: "Name" })
	@IsString()
	@IsOptional()
	name: string;
	@ApiProperty({ default: "NameFa" })
	@IsString()
	@IsOptional()
	nameFa: string;
}
