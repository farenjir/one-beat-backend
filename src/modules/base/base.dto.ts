import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length } from "class-validator";
import { Expose, Type } from "class-transformer";

export { BaseDto, CreateBaseDto, CreateBasesDto, UpdateBaseDto, BaseQuery, BasesQuery };

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
	@ApiProperty({
		default: 0,
		description: "Create a new Base with ( parentId : 0 ) and Create a new Child with ( target Base parentId )",
	})
	@IsInt()
	parentId?: number;
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

class BasesQuery {
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	parentId?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	parentType?: string;
}

class BaseQuery {
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	id?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	type?: string;
}
