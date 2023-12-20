import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard } from "global/guards/auth.guard";
import { RolesGuard } from "global/guards/role.guard";

export const ROLE_KEY = "Roles";

export enum Role {
	Admin = "Admin",
	Editor = "Editor",
	Author = "Author",
	Producer = "Producer",
	User = "User",
}

export const AppGuards = (...roles: Role[]): MethodDecorator & ClassDecorator => {
	// const Roles = Reflector.createDecorator<string[]>()  // new syntax in v.10.2 for RULES !
	return applyDecorators(SetMetadata<string, Role[]>(ROLE_KEY, roles), UseGuards(AuthGuard, RolesGuard));
};
