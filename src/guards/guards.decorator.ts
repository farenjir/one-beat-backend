import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard, RolesGuard } from "./app.guards";

export const RoleKey = "roles";

export enum Role {
	Admin = "admin",
	Editor = "editor",
	Author = "author",
	Producer = "producer",
	User = "user",
}

// const Roles = Reflector.createDecorator<string[]>()  // new syntax for RULES !

export const AppGuards = (...roles: Role[]) =>
	applyDecorators(UseGuards(AuthGuard, RolesGuard), SetMetadata(RoleKey, roles));
