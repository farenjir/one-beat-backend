import { IsEmail, IsInt, IsOptional, IsString } from "class-validator";
import { Expose } from "class-transformer";

export { CreateUserDto, UpdateUserDto, UserDto };

class UserDto {
	@Expose()
	id: number;
	@Expose()
	email: string;
	@Expose()
	token?: string;
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
