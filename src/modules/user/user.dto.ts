import { IsEmail, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

import { Role } from "modules/role/role.enum";

export { CreateUserDto, UpdateUserDto, UserDto, UserTokenDto };

class UserDto {
	@Expose()
	id: number;
	@Expose()
	email: string;
	@Expose()
	roles?: Role[];
}

class CreateUserDto {
	@IsEmail()
	email: string;
	@IsString()
	password: string;
}

class UpdateUserDto {
	@IsEmail()
	@IsOptional()
	email: string;
	@IsString()
	@IsOptional()
	password: string;
}

class UserTokenDto {
	@IsString()
	token?: string;
}
