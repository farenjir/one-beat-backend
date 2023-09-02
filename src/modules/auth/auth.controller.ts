import { Controller, Body, Post, Res, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { cookieKey, cookieOptions } from "utils/cookie.configs";

import { AppGuards } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UserDto } from "modules/user/user.dto";

import { AuthService } from "./auth.service";
import { AuthSignUpDto, AuthExtraDto, SignInDto, AuthIgnoredDto, ForgetPassDto, SignInWithGoogleDto } from "./auth.dto";

@ApiTags("Auth")
@Controller("auth")
@Serialize(AuthIgnoredDto)
export class AuthController {
	constructor(private authService: AuthService) {}
	// auth services
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("signIn")
	@ResponseMessage("2002")
	async signIn(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response): Promise<UserDto> {
		const params = {
			email: body?.email?.toLowerCase(),
			username: body?.username?.toLowerCase(),
			password: body.password,
		};
		const { token, ...user }: UserDto & AuthExtraDto = await this.authService.signin(params);
		res.cookie(cookieKey, token, cookieOptions);
		return user;
	}

	// signUp
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("signUp")
	@ResponseMessage("2003")
	async createUser(@Body() body: AuthSignUpDto): Promise<UserDto> {
		const params = {
			email: body.email.toLowerCase(),
			username: body.username.toLowerCase(),
			password: body.password,
		};
		return await this.authService.signup(params);
	}
	// signOut
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Post("signOut")
	@ResponseMessage("2004")
	async signOut(@Res({ passthrough: true }) res: Response): Promise<void> {
		await res.clearCookie(cookieKey);
	}
	// auth services
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("google")
	@ResponseMessage("2017")
	async signInWithGoogle(
		@Body() { token: gToken }: SignInWithGoogleDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<UserDto> {
		const { token, ...user }: UserDto & AuthExtraDto = await this.authService.authWithGoogle(gToken);
		res.cookie(cookieKey, token, cookieOptions);
		return user;
	}
	// confirm email
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("confirm/:token")
	@ResponseMessage("2015")
	async confirm(@Param("token") token: string): Promise<UserDto> {
		return await this.authService.confirmUserEmail(token);
	}
	// forget password
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("forget/password")
	@ResponseMessage("2015")
	async forgetPass(@Body() body: ForgetPassDto): Promise<UserDto> {
		const params = {
			email: body?.email?.toLowerCase(),
			username: body?.username?.toLowerCase(),
		};
		return await this.authService.forgetPassword(params);
	}
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("recover/password/:token")
	@ResponseMessage("2016", "2001")
	async recoverPass(@Param("token") token: string): Promise<UserDto> {
		return await this.authService.recoverPassword(token);
	}
}
