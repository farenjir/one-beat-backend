import { SetMetadata } from "@nestjs/common";
import { Role } from "./role.enum";
import { globalKeys } from "utils/global.configs";

export const Roles = (...roles: Role[]) => SetMetadata(globalKeys.roleKey, roles);
