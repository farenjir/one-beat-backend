import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Expose, Type, Exclude } from "class-transformer";

export { BaseDto, CreateBaseDto, CreateBasesDto, UpdateBaseDto, BaseQuery, IgnoredBaseDto };

class BaseDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "type" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	type: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
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
	@MaxLength(30)
	@MinLength(1)
	type: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faName" })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
}

class CreateBasesDto {
	@ApiProperty({ default: "type" })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	type: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faName" })
	@IsString()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
	@ApiProperty({ default: [CreateBaseDto] })
	@IsArray()
	children: CreateBaseDto[];
}

class UpdateBaseDto {
	@ApiProperty({ default: 0 })
	@IsInt()
	parentId?: number;
	@ApiProperty({ default: "type" })
	@IsString()
	@IsOptional()
	type: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@IsOptional()
	enName: string;
	@ApiProperty({ default: "faName" })
	@IsString()
	@IsOptional()
	faName: string;
}

class BaseQuery {
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	baseId?: number;
	@IsString()
	@IsOptional()
	baseType?: string;
	@Type(() => Number)
	@IsInt()
	@IsOptional()
	parentId?: number;
	@IsString()
	@IsOptional()
	parentType?: string;
}

class IgnoredBaseDto {
	@Exclude()
	createdAt: Date;
	@Exclude()
	updatedAt: Date;
	@Exclude()
	deletedAt: Date;
}
