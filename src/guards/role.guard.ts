import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLE_KEY } from "modules/role/roles.decorator";
import { Role } from "modules/role/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	// canActivate
	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}
		// userRoles
		const { user } = context.switchToHttp().getRequest();
		return requiredRoles.some((role) => user?.role?.includes(role));
	}
}
