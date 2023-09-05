import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export { AuthSignUpDto, AuthExtraDto, SignInDto, SignInWithGoogleDto, SignInWithAppleDto, AuthIgnoredDto, ForgetPassDto };

// *** params
class SignInDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@IsOptional()
	@MaxLength(24)
	@MinLength(4)
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
	@MaxLength(64)
	@MinLength(5)
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@MaxLength(100)
	@MinLength(8)
	password: string;
}
class SignInWithGoogleDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	token: string;
}
class SignInWithAppleDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	code: string;
}
class AuthSignUpDto {
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
}

class ForgetPassDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@IsOptional()
	@MaxLength(24)
	@MinLength(4)
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
	@MaxLength(64)
	@MinLength(5)
	email?: string;
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
}
