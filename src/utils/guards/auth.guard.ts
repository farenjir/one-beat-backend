import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { COOKIE_Key } from "utils/configs/main.configs";

declare module "express" {
	interface Request {
		user?: {
			id: number;
			roles: string[];
		};
	}
}
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private readonly config: ConfigService,
	) {}
	// canActivate
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies[COOKIE_Key];
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.config.get<string>("JWT_KEY"),
			});
			request["user"] = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}
}
