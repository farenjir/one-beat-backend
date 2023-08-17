import { SetMetadata } from "@nestjs/common";
import { Role, RoleKey } from "./role.enum";

export const Roles = (...roles: Role[]): MethodDecorator => SetMetadata(RoleKey, roles);
