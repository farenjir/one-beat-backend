import { IsArray, IsEmail, IsObject, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { Role } from "guards/guards.decorator";

import { CreateSaveProfileDto, UpdateProfileDto } from "./profile/profile.dto";
import { Profile } from "./profile/profile.entity";

export { UpdateWithProfileUserDto, UserDto, UserIgnoredDto, CreateSaveUserDto };
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
class UpdateWithProfileUserDto {
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
	@ApiProperty({ default: CreateSaveProfileDto })
	@IsOptional()
	profile?: CreateSaveProfileDto;
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
