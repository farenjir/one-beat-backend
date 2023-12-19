import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { UserDto, UserIgnoredDto } from "modules/user/user.dto";

import { BlogLanguages, BlogLevel, BlogStatus } from "./blog.enum";

export { BlogDto, CreateUpdateDto, BlogQuery, BlogsQuery };

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

class BlogsQuery {
	@ApiProperty({ type: Number })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;
	@ApiProperty({ type: Number })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	take?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	faTitle?: string;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	enTitle?: string;
	// enums
	@ApiProperty({ name: "status", enum: BlogStatus, required: false })
	@IsOptional()
	status?: BlogStatus;
	@ApiProperty({ name: "level", enum: BlogLevel, required: false })
	@IsOptional()
	level?: BlogLevel;
	@ApiProperty({ name: "language", enum: [BlogLevel], required: false })
	@IsOptional()
	language?: BlogLanguages[];
	// bases
	@ApiProperty({ type: [Number], required: false })
	@IsOptional()
	groupIds?: number[];
	// relation
	@ApiProperty({ type: [String], required: false })
	@IsOptional()
	tags?: string[];
	// relation
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	authorId?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	username?: string;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	email?: string;
}

class BlogQuery {
	@ApiProperty({ type: Number, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	id?: number;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	faTitle?: string;
	@ApiProperty({ type: String, required: false })
	@IsOptional()
	@IsString()
	enTitle?: string;
}
