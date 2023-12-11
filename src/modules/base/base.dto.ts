import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length } from "class-validator";
import { Expose, Type, Exclude } from "class-transformer";

export { BaseDto, CreateBaseDto, CreateBasesDto, UpdateBaseDto, BaseQuery, IgnoredBaseDto };

class BaseDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "type" })
	@Expose()
	@Length(1, 30)
	type: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@Length(1, 30)
	enName: string;
	@ApiProperty({ default: "faName" })
	@Expose()
	@Length(1, 30)
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
	@Length(1, 30)
	type: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@Length(1, 30)
	enName: string;
	@ApiProperty({ default: "faName" })
	@IsString()
	@Length(1, 30)
	faName: string;
}

class CreateBasesDto {
	@ApiProperty({ default: "type" })
	@IsString()
	@Length(1, 30)
	type: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@Length(1, 30)
	enName: string;
	@ApiProperty({ default: "faName" })
	@IsString()
	@Length(1, 30)
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
