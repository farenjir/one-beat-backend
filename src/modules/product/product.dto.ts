import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";

import { Role } from "global/guards.decorator";

import { UserDto, UserIgnoredDto } from "modules/user/user.dto";

import { ProductLevel, ProductStatus } from "./product.enum";

export { ProductDto, CreateUpdateProductDto, ProductQuery };

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

class ProductQuery {
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
	faName?: string;
	@IsString()
	@IsOptional()
	enName?: string;
	@IsOptional()
	status?: ProductStatus;
	@IsOptional()
	level?: ProductLevel;
	// bases
	@IsOptional()
	genreIds?: number[];
	@IsOptional()
	tempoIds?: number[];
	@IsOptional()
	groupIds?: number[];
	@IsOptional()
	moodIds?: number[];
	// relation
	@IsInt()
	@Type(() => Number)
	@IsOptional()
	producerId?: number;
	@IsString()
	@IsOptional()
	username?: string;
	@IsString()
	@IsOptional()
	email?: string;
}
