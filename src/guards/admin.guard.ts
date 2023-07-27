import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
	canActivate(context: ExecutionContext) {
		const { currentUser } = context.switchToHttp().getRequest();
		if (currentUser) {
			return currentUser.admin;
		} else {
			return false;
		}
	}
}
