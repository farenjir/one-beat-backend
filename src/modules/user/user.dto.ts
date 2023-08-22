import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { Role } from "guards/guards.decorator";

import { CreateSaveProfileDto } from "./profile/profile.dto";

export { UpdateProfileDto, UserDto, UserIgnoredDto, CreateSaveUserDto, UpdateUserDto };
export { IUserQuery };

// *** params
class UserDto {
	@ApiProperty()
	id: number;
	@ApiProperty({ default: "test" })
	@IsString()
	username: string;
	@ApiProperty({ default: "test@test.com" })
	email: string;
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	@IsOptional()
	roles?: Role[];
}
class CreateSaveUserDto {
	@IsString()
	username: string;
	@IsEmail()
	email: string;
	@IsString()
	password: string;
}
class UpdateProfileDto {
	@ApiProperty({ default: CreateSaveProfileDto })
	@IsOptional()
	profile?: CreateSaveProfileDto;
}
class UpdateUserDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@IsOptional()
	username?: string;
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
}

// *** response
class UserIgnoredDto {
	@Exclude()
	password: string;
	@Exclude()
	deletedAt: Date;
}

// *** interfaces
interface IUserQuery {
	id?: number;
	username?: string;
	email?: string;
}
