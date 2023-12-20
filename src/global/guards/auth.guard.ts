import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { TOKEN_KEY } from "utils/main.configs";

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
		const token = request.cookies[TOKEN_KEY];
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
