import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

import { Role } from "global/guards.decorator";

import { CreateSaveProfileDto } from "./profile/profile.dto";
import { UserKycDto } from "./kyc/kyc.dto";

export { UserDto, CreateSaveUserDto, UserProfileDto, UpdateProfileDto };
export { IUserQuery, UserIgnoredDto, UserProfileResponseDto };

// *** user params
class UserDto {
	@ApiProperty()
	id: number;
	@ApiProperty({ default: "test" })
	@IsString()
	@MaxLength(24)
	@MinLength(4)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@MaxLength(64)
	@MinLength(5)
	email: string;
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	@IsOptional()
	roles?: Role[];
	@ApiProperty({ default: UserKycDto })
	@IsOptional()
	kyc: UserKycDto;
}
class CreateSaveUserDto {
	@IsString()
	@MaxLength(24)
	@MinLength(4)
	username: string;
	@IsEmail()
	@MaxLength(64)
	@MinLength(5)
	email: string;
	@IsString()
	@MaxLength(100)
	@MinLength(8)
	@IsOptional()
	password?: string;
}

// *** profile
class UserProfileDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@MaxLength(24)
	@MinLength(4)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@MaxLength(64)
	@MinLength(5)
	email: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@MaxLength(100)
	@MinLength(8)
	password: string;
	@IsArray()
	@IsOptional()
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	roles?: Role[];
	@ApiProperty({ default: UserKycDto })
	@IsOptional()
	kyc?: UserKycDto;
	@ApiProperty({ default: CreateSaveProfileDto })
	@IsOptional()
	profile?: CreateSaveProfileDto;
}

class UserProfileResponseDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@MaxLength(24)
	@MinLength(4)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@MaxLength(64)
	@MinLength(5)
	email: string;
	@IsArray()
	@IsOptional()
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	roles?: Role[];
	@ApiProperty({ default: UserKycDto })
	@IsOptional()
	kyc?: UserKycDto;
	@ApiProperty({ default: CreateSaveProfileDto })
	@IsOptional()
	profile?: CreateSaveProfileDto;
}

class UpdateProfileDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@MaxLength(24)
	@MinLength(4)
	@IsOptional()
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@MaxLength(64)
	@MinLength(5)
	@IsOptional()
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@MaxLength(100)
	@MinLength(8)
	@IsOptional()
	password?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@MaxLength(100)
	@MinLength(8)
	@IsOptional()
	currentPassword?: string;
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
