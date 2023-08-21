import { IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { Bases } from "modules/base/base.entity";

export { UpdateProfileDto, ProfileDto, CreateSaveProfileDto };

// *** params
class ProfileDto {
	@ApiProperty()
	id: number;
	@IsOptional()
	gender?: Bases;
}
class CreateSaveProfileDto {
	@IsInt()
	genderId: number;
}
class UpdateProfileDto {
	@ApiProperty({ default: 0 })
	@IsInt()
	@IsOptional()
	genderId?: number;
}
