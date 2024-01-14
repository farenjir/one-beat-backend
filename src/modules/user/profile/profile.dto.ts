import { IsArray, IsInt, IsOptional, Length, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export { UpdateProfileDto, ProfileDto, CreateSaveProfileDto };

// *** params
class CreateSaveProfileDto {
	@ApiProperty({ default: "nickname" })
	@Length(1, 24)
	nickname: string;
	@ApiProperty({ default: "test" })
	@Length(4, 24)
	firstName: string;
	@ApiProperty({ default: "test" })
	@Length(4, 24)
	lastName: string;
	@ApiProperty({ default: "09388227228" })
	@Length(11, 11)
	mobileNumber: string;
	@ApiProperty({ default: 12 })
	@Min(12)
	@Max(99)
	age: number;
	// *** relations params
	@ApiProperty({ type: Number })
	@IsInt()
	@IsOptional()
	genderId?: number;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	skillIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	favoriteIds?: number[];
}
class ProfileDto extends CreateSaveProfileDto {
	@ApiProperty()
	id: number;
}

class UpdateProfileDto {
	@ApiProperty({ default: "nickname" })
	@Length(1, 24)
	nickname: string;
	@ApiProperty({ default: "test" })
	@Length(4, 24)
	firstName?: string;
	@ApiProperty({ default: "test" })
	@Length(4, 24)
	lastName?: string;
	@ApiProperty({ default: "09388227228" })
	@Length(11, 11)
	mobileNumber?: string;
	@ApiProperty({ default: 12 })
	@Min(12)
	@Max(99)
	age?: number;
	// *** relations params
	@ApiProperty({ type: Number })
	@IsInt()
	@IsOptional()
	genderId?: number;
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	expertiseIds?: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	skillIds: number[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@IsOptional()
	favoriteIds?: number[];
}
