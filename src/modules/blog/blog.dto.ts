import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { BlogLanguages, BlogLevel, BlogStatus } from "./blog.enum";
import { TagDto } from "modules/tag/tag.dto";
import { UserDto, UserIgnoredDto } from "modules/user/user.dto";

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
	// *** enums
	@ApiProperty({
		name: "language",
		enum: BlogLanguages,
		default: [BlogLanguages.Farsi],
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
	@ApiProperty({ default: [TagDto] })
	tags?: TagDto[];
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
	// *** enums
	@ApiProperty({
		name: "language",
		enum: BlogLanguages,
		default: [BlogLanguages.Farsi],
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
	@ApiProperty({ type: [Number], default: [] })
	@IsOptional()
	tagIds?: number[];
}

class BlogQuery {
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number;
	@IsInt()
	@IsOptional()
	@Type(() => Number)
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
	language?: BlogLanguages[];
	@IsOptional()
	status?: BlogStatus;
	@IsOptional()
	level?: BlogLevel;
	// bases
	@IsOptional()
	groupIds?: number[];
	// relation
	@IsOptional()
	tags?: number[];
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
