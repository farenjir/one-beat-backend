import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { UserDto, UserIgnoredDto } from "modules/user/user.dto";

import { BlogLanguages, BlogLevel, BlogStatus } from "./blog.enum";

export { BlogDto, BlogQuery, CreateUpdateDto };

class BlogDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "faTitle" })
	@Expose()
	@Length(1, 30)
	faTitle: string;
	@ApiProperty({ default: "enTitle" })
	@Expose()
	@Length(1, 30)
	enTitle: string;
	@ApiProperty({ default: "faContent" })
	@Expose()
	@Length(300)
	faContent?: string;
	@ApiProperty({ default: "enContent" })
	@Expose()
	@Length(300)
	enContent?: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	@Length(1, 99)
	coverFileName: string;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	groupIds: number[];
	@ApiProperty({ type: [String], default: [] })
	@IsArray()
	@Expose()
	tags?: string[];
	// *** enums
	@ApiProperty({
		name: "language",
		enum: BlogLanguages,
		default: [BlogLanguages.Farsi, BlogLanguages.English],
	})
	@IsOptional()
	language?: BlogLanguages[];
	@ApiProperty({
		name: "status",
		enum: BlogStatus,
		default: BlogStatus.Inprogress,
	})
	@IsOptional()
	status?: BlogStatus;
	@ApiProperty({
		name: "level",
		enum: BlogLevel,
		default: BlogLevel.Potential,
	})
	@IsOptional()
	level?: BlogLevel;
	// *** relations
	@ApiProperty({ default: UserDto })
	@Type(() => UserIgnoredDto)
	author?: UserDto;
	// *** defaults
	@ApiProperty({ type: Date })
	@Expose()
	createdAt: Date;
	@ApiProperty({ type: Date })
	@Expose()
	updatedAt: Date;
	@ApiProperty({ type: Date })
	@Exclude()
	deletedAt: Date;
}

class CreateUpdateDto {
	@ApiProperty({ default: "faTitle" })
	@Expose()
	@Length(1, 30)
	faTitle: string;
	@ApiProperty({ default: "enTitle" })
	@Expose()
	@Length(1, 30)
	enTitle: string;
	@ApiProperty({ default: "faContent" })
	@Expose()
	@IsString()
	@Length(300)
	faContent?: string;
	@ApiProperty({ default: "enContent" })
	@Expose()
	@IsString()
	@Length(300)
	enContent?: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	@Length(1, 99)
	coverFileName: string;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	groupIds: number[];
	@ApiProperty({ type: [String], default: [] })
	@IsArray()
	@Expose()
	tags: string[];
	// *** enums
	@ApiProperty({
		name: "language",
		enum: BlogLanguages,
		default: [BlogLanguages.Farsi, BlogLanguages.English],
	})
	@IsOptional()
	language?: BlogLanguages[];
	@ApiProperty({
		name: "status",
		enum: BlogStatus,
		default: BlogStatus.Inprogress,
	})
	@IsOptional()
	status?: BlogStatus;
	@ApiProperty({
		name: "level",
		enum: BlogLevel,
		default: BlogLevel.Potential,
	})
	@IsOptional()
	level?: BlogLevel;
}

class BlogQuery {
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	take?: number;
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	id?: number;
	@IsString()
	@IsOptional()
	faTitle?: string;
	@IsString()
	@IsOptional()
	enTitle?: string;
	// enums
	@IsOptional()
	status?: BlogStatus;
	@IsOptional()
	level?: BlogLevel;
	@IsOptional()
	language?: BlogLanguages[];
	// bases
	@IsOptional()
	groupIds?: number[];
	// relation
	@IsOptional()
	tags?: string[];
	// relation
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	authorId?: number;
	@IsString()
	@IsOptional()
	username?: string;
	@IsString()
	@IsOptional()
	email?: string;
}
