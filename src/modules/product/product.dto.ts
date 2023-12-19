import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { Role } from "global/guards.decorator";

import { UserDto, UserIgnoredDto } from "modules/user/user.dto";

import { ProductLevel, ProductStatus } from "./product.enum";

export { ProductDto, CreateUpdateProductDto, ProductQuery, ProductsQuery };

class ProductDto {
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
	@ApiProperty({
		name: "status",
		enum: ProductStatus,
		default: ProductStatus.Inprogress,
	})
	status?: ProductStatus;
	@IsOptional({
		groups: [Role.Admin, Role.Editor],
	})
	level?: ProductLevel;
	// *** relations
	@ApiProperty({ default: UserDto })
	@Type(() => UserIgnoredDto)
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

class CreateUpdateProductDto {
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
	@Length(1, 99)
	@Expose()
	demoFileName: string;
	// *** enums
	@ApiProperty({
		name: "status",
		enum: ProductStatus,
		default: ProductStatus.Inprogress,
	})
	status?: ProductStatus;
	@ApiProperty({
		name: "level",
		enum: ProductLevel,
		default: ProductLevel.Potential,
	})
	level?: ProductLevel;
	// *** relations
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
}

class ProductsQuery {
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
	@ApiProperty({ name: "status", enum: ProductStatus, required: false })
	@IsOptional()
	status?: ProductStatus;
	@ApiProperty({ name: "level", enum: ProductLevel, required: false })
	@IsOptional()
	level?: ProductLevel;
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

class ProductQuery {
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
