import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export { AuthSignUpDto, AuthExtraDto, SignInDto, SignInWithGoogleDto, SignInWithAppleDto, AuthIgnoredDto, ForgetPassDto };

// *** params
class SignInDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@IsOptional()
	@Length(4, 65)
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
	email?: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@Length(8, 100)
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
	@Length(4, 24)
	username: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	email: string;
	@ApiProperty({ default: "P@ssword123" })
	@IsString()
	@Length(8, 100)
	password: string;
}

class ForgetPassDto {
	@ApiProperty({ default: "test" })
	@IsString()
	@IsOptional()
	@Length(4, 24)
	username?: string;
	@ApiProperty({ default: "test@test.com" })
	@IsEmail()
	@IsOptional()
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
