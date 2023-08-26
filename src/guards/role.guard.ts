import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { Role, RoleKey } from "../global/guards.decorator";

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
