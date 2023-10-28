import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard } from "utils/guards/auth.guard";
import { RolesGuard } from "utils/guards/role.guard";

export const ROLE_KEY = "Roles";

export enum Role {
	Admin = "admin",
	Editor = "editor",
	Author = "author",
	Producer = "producer",
	User = "user",
}

// const Roles = Reflector.createDecorator<string[]>()  // new syntax in v.10.2 for RULES !

export const AppGuards = (...roles: Role[]): MethodDecorator & ClassDecorator => {
	return applyDecorators(SetMetadata<string, Role[]>(ROLE_KEY, roles), UseGuards(AuthGuard, RolesGuard));
};
