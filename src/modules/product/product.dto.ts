import { ApiProperty } from "@nestjs/swagger";
import { IsArray, MaxLength, MinLength } from "class-validator";
import { Expose } from "class-transformer";

import { UserDto } from "modules/user/user.dto";
import { BaseDto } from "modules/base/base.dto";

export { ProductDto, CreateProductDto };

class ProductDto {
	@ApiProperty()
	@Expose()
	id: string;
	@ApiProperty({ default: "faName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	faDescription: string;
	@ApiProperty({ default: "enDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	enDescription: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	coverFileName: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	demoFileName: string;
	// relations
	@ApiProperty({ default: UserDto })
	@Expose()
	producer?: UserDto;
	// base relations
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	genre: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	tempo: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	group: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	mood: BaseDto[];
	// defaults
	@ApiProperty({ type: Date })
	@Expose()
	createdAt: Date;
	@ApiProperty({ type: Date })
	@Expose()
	updatedAt: Date;
	@ApiProperty({ type: Date })
	@Expose()
	deletedAt: Date;
}

class CreateProductDto {
	@ApiProperty({ default: "faName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	faDescription: string;
	@ApiProperty({ default: "enDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	enDescription: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	coverFileName: string;
	@ApiProperty({ default: "uploadFileName" })
	@Expose()
	demoFileName: string;
	// base relations
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	genre: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	tempo: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	group: BaseDto[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	mood: BaseDto[];
}
