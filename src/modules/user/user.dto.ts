import { IsArray, IsEmail, IsObject, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { Role } from "guard/guard.decorator";

import { UpdateProfileDto, ProfileDto, CreateSaveProfileDto} from "./profile/profile.dto";

export { UpdateUserDto, UserDto, UserIgnoredDto, CreateSaveUserDto };

// *** params
class UserDto {
	@ApiProperty()
	id: number;
	@ApiProperty({ default: "test@test.com" })
	email: string;
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	@IsOptional()
	roles?: Role[];
	@IsOptional()
	profile?: ProfileDto;
}
class CreateSaveUserDto {
	@IsEmail()
	email: string;
	@IsString()
	password: string;
	@IsObject()
	profile?: CreateSaveProfileDto;
}
class UpdateUserDto {
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@IsOptional()
	password?: string;
	@IsArray()
	@IsOptional()
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	roles?: Role[];
	@ApiProperty({ default: {} })
	@IsObject()
	@IsOptional()
	profile?: UpdateProfileDto;
}

// *** response
class UserIgnoredDto {
	@Exclude()
	password: string;
	@Exclude()
	deletedAt: Date;
}
