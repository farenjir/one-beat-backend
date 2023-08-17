import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { Role, RoleKey } from "./guard.decorator";

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
		const token = request.cookies["app-token"];
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

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	// canActivate
	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(RoleKey, [context.getHandler(), context.getClass()]);
		if (!requiredRoles || !requiredRoles?.length) {
			return true;
		}
		// userRoles
		const { user } = context.switchToHttp().getRequest();
		return requiredRoles?.some((role) => user?.roles?.includes(role)) ?? false;
	}
}
