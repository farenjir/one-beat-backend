import { IsEmail, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

import { Role } from "global/guards.decorator";

import { CreateSaveProfileDto } from "./profile/profile.dto";
import { UserKycDto } from "./kyc/kyc.dto";

export { UserDto, CreateSaveUserDto, UserProfileDto, UpdateProfileDto, UserQuery };
export { IUserQuery, UserIgnoredDto, UserProfileResponseDto };

// *** user params
class UserDto {
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	take?: number;
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "test" })
	@IsString()
	@Length(4, 24)
	@Expose()
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@Expose()
	email: string;
	@ApiProperty({
		name: "role",
		enum: Role,
		default: Role.User,
	})
	@IsOptional()
	@Expose()
	role?: Role;
	@ApiProperty({ default: UserKycDto })
	@IsOptional()
	@Expose()
	kyc: UserKycDto;
}
class CreateSaveUserDto {
	@IsString()
	@Length(4, 24)
	username: string;
	@IsEmail()
	email: string;
	@IsString()
	@Length(8, 100)
	@IsOptional()
	password?: string;
}

// *** profile
class UserProfileDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@Length(4, 24)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@Length(8, 100)
	password: string;
	@IsOptional()
	@ApiProperty({
		name: "role",
		enum: Role,
		default: Role.User,
	})
	role?: Role;
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
	@Length(4, 24)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email: string;
	@IsOptional()
	@ApiProperty({
		name: "role",
		enum: Role,
		default: Role.User,
	})
	role?: Role;
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
	@Length(4, 24)
	@IsOptional()
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@Length(8, 100)
	@IsOptional()
	password?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@Length(8, 100)
	@IsOptional()
	currentPassword?: string;
	@ApiProperty({ default: CreateSaveProfileDto })
	@IsOptional()
	profile?: CreateSaveProfileDto;
}

class UserQuery {
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number;
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	take?: number;
	@IsInt()
	@IsOptional()
	@Type(() => Number)
	id?: number;
	@IsString()
	@IsOptional()
	username?: string;
	@IsString()
	@IsOptional()
	email?: string;
	@ApiProperty({
		name: "role",
		enum: Role,
		default: Role.User,
	})
	@IsOptional()
	role?: Role;
	@ApiProperty({ default: UserKycDto })
	@IsOptional()
	kyc?: UserKycDto;
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
