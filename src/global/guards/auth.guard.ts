import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { COOKIE_TOKEN_KEY } from "app/app.configs";

import { Role } from "global/guards.decorator";

declare module "express" {
	interface Request {
		user?: {
			id: number;
			role: Role;
		};
	}
}
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private config: ConfigService,
	) {}
	// canActivate
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		// get token from cookie or header ( `Bearer token-hash-...`)
		const token = request.cookies[COOKIE_TOKEN_KEY] || request.headers?.authorization?.split(" ")?.[1];
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
