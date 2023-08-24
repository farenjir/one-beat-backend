import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard, RolesGuard } from "./app.guard";

export const RoleKey = "roles";

export enum Role {
	Admin = "sAdmin",
	Editor = "editor",
	Author = "author",
	Producer = "producer",
	User = "user",
}

// const Roles = Reflector.createDecorator<string[]>()  // new syntax in v.10.2 for RULES !

export const AppGuards = (...roles: Role[]) =>
	applyDecorators(SetMetadata(RoleKey, roles), UseGuards(AuthGuard, RolesGuard));
