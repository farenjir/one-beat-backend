import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { Role } from "modules/role/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export { CreateUserDto, UpdateUserDto, UserDto, UserTokenDto };

class UserDto {
	@Expose()
	id: number;
	@Expose()
	email: string;
	@Expose()
	@IsOptional()
	roles?: Role[];
}

class CreateUserDto {
	@IsEmail()
	@ApiProperty({})
	email: string;
	@IsString()
	@ApiProperty({})
	password: string;
}

class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	@ApiProperty({})
	email?: string;
	@IsString()
	@IsOptional()
	@ApiProperty({})
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

class UserTokenDto {
	@IsString()
	@IsOptional()
	token?: string;
}
