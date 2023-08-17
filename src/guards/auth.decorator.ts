import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";

import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./role.guard";

export const RoleKey = "roles";

export enum Role {
	Admin = "admin",
	Editor = "editor",
	Author = "author",
	Producer = "producer",
	User = "user",
}

export const AppGuards = (...roles: Role[]) => {
	// return
	return applyDecorators(SetMetadata(RoleKey, roles), UseGuards(AuthGuard, RolesGuard));
};
