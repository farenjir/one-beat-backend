import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Session } from "express-session";

import { UsersService } from "./user.service";

interface SessionWithUserId extends Session {
	userId?: number;
}
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private readonly usersService: UsersService) {}
	// intercept
	async intercept(context: ExecutionContext, handler: CallHandler) {
		const req = context.switchToHttp().getRequest();
		const { userId } = (req.session as SessionWithUserId) ?? {};
		if (userId) {
			req.currentUser = await this.usersService.findById(userId);
		}
		// return
		return handler.handle();
	}
}
