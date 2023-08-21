import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export { AuthSignUpDto, AuthExtraDto, SignInDto, AuthIgnoredDto };

// *** params
class SignInDto {
	@ApiProperty({ default: "test" })
	@IsString()
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	password: string;
}
class AuthSignUpDto {
	@ApiProperty({ default: "test" })
	@IsString()
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	password: string;
}

// *** response
class AuthIgnoredDto {
	@Exclude()
	password: string;
	@Exclude()
	deletedAt: Date;
}

// *** other
class AuthExtraDto {
	@IsString()
	@IsOptional()
	token?: string;
	@IsOptional()
	cookieOptions?: object;
}
