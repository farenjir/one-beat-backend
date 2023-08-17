import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { Role } from "guards/auth.decorator";
import { ApiProperty } from "@nestjs/swagger";

export { CreateUserDto, UpdateUserDto, UserDto, UserExtraDto };

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
}

class CreateUserDto {
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	password: string;
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

class UserExtraDto {
	@IsString()
	@IsOptional()
	token?: string;
	@IsOptional()
	cookieOptions?: object;
}
