import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length } from "class-validator";
import { Expose, Type } from "class-transformer";

import { TagType } from "./tag.enum";

export { TagDto, CreateDto, UpdateDto, CreateTagsDto, TagQuery };

class TagDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "faName" })
	@Expose()
	@Length(1, 30)
	faName: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@Length(1, 30)
	enName: string;
	@Expose()
	@ApiProperty({
		name: "type",
		enum: TagType,
		default: TagType.Blog,
	})
	@IsOptional()
	type?: TagType;
}

class CreateDto {
	@ApiProperty({ default: "faName" })
	@IsString()
	@Length(1, 30)
	faName: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@Length(1, 30)
	enName: string;
	@ApiProperty({
		name: "type",
		enum: TagType,
		default: TagType.Blog,
	})
	@IsOptional()
	type?: TagType;
}

class UpdateDto {
	@ApiProperty({ default: "faName" })
	@IsString()
	@IsOptional()
	faName: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@IsOptional()
	enName: string;
	@ApiProperty({
		name: "type",
		enum: TagType,
		default: TagType.Blog,
	})
	@IsOptional()
	type?: TagType;
}

class CreateTagsDto {
	@ApiProperty({ default: "faName" })
	@IsString()
	@Length(1, 30)
	faName: string;
	@ApiProperty({ default: "enName" })
	@IsString()
	@Length(1, 30)
	enName: string;
	@ApiProperty({
		name: "type",
		enum: TagType,
		default: TagType.Blog,
	})
	@IsOptional()
	type?: TagType;
}

class TagQuery {
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	id?: number;
	@IsString()
	@IsOptional()
	faName?: string;
	@IsString()
	@IsOptional()
	enName?: string;
	@IsOptional()
	type?: TagType;
}
