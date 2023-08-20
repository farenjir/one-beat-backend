import { IsArray, IsEmail, IsObject, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

import { Role } from "guard/guard.decorator";

import { Bases } from "modules/base/base.entity";

export { UpdateUserDto, UserDto, UserIgnoredDto, CreateSaveUserDto };

// *** params
class UserDto {
	@ApiProperty()
	@Expose()
	id: number;
	@ApiProperty({ default: "test@test.com" })
	@Expose()
	email: string;
	@ApiProperty({
		name: "roles",
		enum: Role,
		default: [Role.User],
	})
	@Expose()
	@IsOptional()
	roles?: Role[];
	@Expose()
	@IsOptional()
	gender?: Bases;
}
class CreateSaveUserDto {
	@IsEmail()
	email: string;
	@IsString()
	password: string;
	@IsObject()
	gender: Bases;
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
}

// *** response
class UserIgnoredDto {
	@Exclude()
	password: string;
	@Exclude()
	deletedAt: Date;
}
