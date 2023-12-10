import { ApiProperty } from "@nestjs/swagger";
import { IsArray, MaxLength, MinLength } from "class-validator";
import { Expose } from "class-transformer";

import { UserDto } from "modules/user/user.dto";

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
	// relations
	@ApiProperty({ default: UserDto })
	@Expose()
	producer?: UserDto;
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
