import { Controller, Body, Post, Res, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AppGuards } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { Serialize } from "global/serialize.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UserDto } from "modules/user/user.dto";

import { AuthService } from "./auth.service";
import { AuthSignUpDto, AuthExtraDto, SignInDto, AuthIgnoredDto } from "./auth.dto";

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
		const { token, cookieOptions, ...user }: UserDto & AuthExtraDto = await this.authService.signin(params);
		res.cookie("app-token", token, cookieOptions);
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
		await res.clearCookie("app-token");
	}
	// confirm email
	@Post("confirm/:token")
	@ResponseMessage("")
	async confirm(@Param("token") token: string): Promise<void> {
		await this.authService.confirmUserEmail(token);
	}
}
