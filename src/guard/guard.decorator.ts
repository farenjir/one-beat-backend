import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard, RolesGuard } from "./app.guard";

export const RoleKey = "roles";

export enum Role {
	Admin = "admin",
	Editor = "editor",
	Author = "author",
	Producer = "producer",
	User = "user",
}

export const AppGuards = (...roles: Role[]) => applyDecorators(SetMetadata(RoleKey, roles), UseGuards(AuthGuard, RolesGuard));
