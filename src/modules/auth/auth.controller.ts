import { Controller, Body, Post, Res, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response, Request } from "express";

import { AppGuards } from "guard/guard.decorator";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { Serialize } from "utils/serialize.interceptor";

import { AuthSignUpDto, AuthExtraDto, SignInDto, AuthIgnoredDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { UserDto } from "modules/user/user.dto";

@ApiTags("Auth")
@Controller("auth")
@Serialize(AuthIgnoredDto, false)
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	// auth services
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("signIn")
	async signIn(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response): Promise<AppResponseDto<UserDto>> {
		const params = {
			email: body.email.toLowerCase(),
			password: body.password,
		};
		const { token, cookieOptions, ...user }: UserDto & AuthExtraDto = await this.authService.signin(params);
		res.cookie("app-token", token, cookieOptions);
		return appResponse(user, "2002");
	}
	// signUp
	@SwaggerDocumentaryApi(UserDto, { useAuth: false })
	@Post("signUp")
	async createUser(@Body() body: AuthSignUpDto): Promise<AppResponseDto<UserDto>> {
		const params = {
			email: body.email.toLowerCase(),
			password: body.password,
			genderId: body.genderId,
		};
		const userCreated: UserDto = await this.authService.signup(params);
		return appResponse(userCreated, "2003");
	}
	// signOut
	@SwaggerDocumentaryApi(UserDto)
	@AppGuards()
	@Post("signOut")
	signOut(@Res({ passthrough: true }) res: Response, @Req() { user }: Request): AppResponseDto<any> {
		res.clearCookie("app-token");
		return appResponse(user, "2004");
	}
}
