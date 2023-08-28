import { IsArray, IsInt, IsOptional, Length, Max, MaxLength, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export { UpdateProfileDto, ProfileDto, CreateSaveProfileDto };

// *** params
class CreateSaveProfileDto {
	@ApiProperty({ default: "test" })
	@MaxLength(24)
	@MinLength(4)
	firstName: string;
	@ApiProperty({ default: "test" })
	@MaxLength(24)
	@MinLength(4)
	lastName: string;
	@ApiProperty({ default: "09388227228" })
	@Length(11)
	mobileNumber: string;
	@ApiProperty({ default: 12 })
	@Min(12)
	@Max(99)
	age: number;
	// *** relations params
	@ApiProperty({ type: Number })
	@IsInt()
	genderId: number;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	skillsIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	favoritesIds?: number[];
}
class ProfileDto extends CreateSaveProfileDto {
	@ApiProperty()
	id: number;
}

class UpdateProfileDto {
	@ApiProperty({ default: "test" })
	@MaxLength(24)
	@MinLength(4)
	firstName?: string;
	@ApiProperty({ default: "test" })
	@MaxLength(24)
	@MinLength(4)
	lastName?: string;
	@ApiProperty({ default: "09388227228" })
	@Length(11)
	mobileNumber?: string;
	@ApiProperty({ default: 12 })
	@Min(12)
	@Max(99)
	age?: number;
	// *** relations params
	@ApiProperty({ type: Number })
	@IsInt()
	genderId: number;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	skillsIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	favoritesIds?: number[];
}
