import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Length } from "class-validator";
import { Expose, Type } from "class-transformer";

import { TagType } from "./tag.enum";

export { TagDto, CreateDto, UpdateDto, CreateTagsDto, TagQuery, TagsQuery };

class TagDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "name" })
	@Expose()
	@Length(1, 30)
	name: string;
	@Expose()
	@ApiProperty({ name: "type", enum: TagType, default: TagType.Blog })
	@IsOptional()
	type?: TagType;
}

class CreateDto {
	@ApiProperty({ default: "name" })
	@IsString()
	@Length(1, 30)
	name: string;
	@ApiProperty({ name: "type", enum: TagType, default: TagType.Blog })
	@IsOptional()
	type?: TagType;
}

class UpdateDto {
	@ApiProperty({ default: "name" })
	@IsString()
	@IsOptional()
	name: string;
	@ApiProperty({ name: "type", enum: TagType, default: TagType.Blog })
	@IsOptional()
	type?: TagType;
}

class CreateTagsDto {
	@ApiProperty({ default: "name" })
	@IsString()
	@Length(1, 30)
	name: string;
	@ApiProperty({ name: "type", enum: TagType, default: TagType.Blog })
	@IsOptional()
	type?: TagType;
}

class TagQuery {
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	id?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	name?: string;
}

class TagsQuery {
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	name?: string;
	@ApiProperty({ name: "type", enum: TagType, required: false })
	@IsOptional()
	type?: TagType;
}
