import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { Role } from "global/guards.decorator";

import { UserDto, UserIgnoredKycDto } from "modules/user/user.dto";

import { PackageLevel, PackageStatus } from "./package.enum";

export { PackageDto, CreateUpdatePackageDto, PackageQuery, PackagesQuery };

class PackageDto {
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
	@ApiProperty({ default: "faDescription" })
	@Expose()
	@Length(30, 300)
	faDescription: string;
	@ApiProperty({ default: "enDescription" })
	@Expose()
	@Length(30, 300)
	enDescription: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	@Length(1, 99)
	coverFileName: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	@Length(1, 99)
	demoFileName: string;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	genreIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	tempoIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	groupIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	moodIds: number[];
	// *** enums
	@ApiProperty({ name: "status", enum: PackageStatus, default: PackageStatus.Inprogress })
	@IsOptional({ groups: [Role.Admin, Role.Editor] })
	status?: PackageStatus;
	@ApiProperty({ name: "level", enum: PackageLevel, default: PackageLevel.Potential })
	@IsOptional({ groups: [Role.Admin, Role.Editor] })
	level?: PackageLevel;
	// *** relations
	@ApiProperty({ default: UserDto })
	@Type(() => UserIgnoredKycDto)
	producer?: UserDto;
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

class CreateUpdatePackageDto {
	@ApiProperty({ default: "faName" })
	@Length(1, 30)
	faName: string;
	@ApiProperty({ default: "enName" })
	@Length(1, 30)
	enName: string;
	@ApiProperty({ default: "faDescription" })
	@Length(30, 300)
	faDescription: string;
	@ApiProperty({ default: "enDescription" })
	@Length(30, 300)
	enDescription: string;
	@ApiProperty({ default: "uploadFileName" })
	@Length(1, 99)
	coverFileName: string;
	@ApiProperty({ default: "uploadFileName" })
	@Length(1, 99)
	demoFileName: string;
	// *** enums
	@ApiProperty({ name: "status", enum: PackageStatus, default: PackageStatus.Inprogress })
	status?: PackageStatus;
	@ApiProperty({ name: "level", enum: PackageLevel, default: PackageLevel.Potential })
	level?: PackageLevel;
	// *** relations
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	genreIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	tempoIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	groupIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	moodIds: number[];
}

class PackagesQuery {
	@ApiProperty({ type: Number })
	@IsInt()
	@IsOptional()
	@Type(() => Number)
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
	@IsString()
	@IsOptional()
	faName?: string;
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	enName?: string;
	@ApiProperty({ name: "status", enum: PackageStatus, required: false })
	@IsOptional()
	status?: PackageStatus;
	@ApiProperty({ name: "level", enum: PackageLevel, required: false })
	@IsOptional()
	level?: PackageLevel;
	// bases
	@ApiProperty({ type: [Number], required: false })
	@IsOptional()
	@IsArray()
	genreIds?: number[];
	@ApiProperty({ type: [Number], required: false })
	@IsOptional()
	@IsArray()
	tempoIds?: number[];
	@ApiProperty({ type: [Number], required: false })
	@IsOptional()
	@IsArray()
	groupIds?: number[];
	@ApiProperty({ type: [Number], required: false })
	@IsOptional()
	@IsArray()
	moodIds?: number[];
	// relation
	@ApiProperty({ type: Number, required: false })
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	producerId?: number;
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	username?: string;
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	email?: string;
}

class PackageQuery {
	@ApiProperty({ type: Number, required: false })
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	id?: number;
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	faName?: string;
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	enName?: string;
}
