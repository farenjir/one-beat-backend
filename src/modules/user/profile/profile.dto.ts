import { IsArray, IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export { UpdateProfileDto, ProfileDto, CreateSaveProfileDto };

// *** params
class CreateSaveProfileDto {
	@ApiProperty({ default: "test" })
	firstName: string;
	@ApiProperty({ default: "test" })
	lastName: string;
	@ApiProperty({ default: "09388227228" })
	mobileNumber: string;
	@ApiProperty({ default: 12 })
	age: number;
	// *** relations params
	@ApiProperty({ default: 0 })
	@IsInt()
	@IsOptional()
	genderId?: number;
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	skillsIds?: number[];
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	favoritesIds?: number[];
}
class ProfileDto extends CreateSaveProfileDto {
	@ApiProperty()
	profileId: number;
}

class UpdateProfileDto {
	@ApiProperty({ default: "test" })
	firstName?: string;
	@ApiProperty({ default: "test" })
	lastName?: string;
	@ApiProperty({ default: "09388227228" })
	mobileNumber?: string;
	@ApiProperty({ default: 12 })
	age?: number;
	// *** relations params
	@ApiProperty({ default: 0 })
	@IsInt()
	@IsOptional()
	genderId?: number;
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	skillsIds: number[];
	@ApiProperty({ default: [] })
	@IsArray()
	@IsOptional()
	favoritesIds?: number[];
}
