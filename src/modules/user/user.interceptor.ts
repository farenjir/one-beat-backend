import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "./user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private usersService: UsersService) {}
	// intercept
	async intercept(context: ExecutionContext, handler: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const { userId } = request.session || {};
		if (userId) {
			request.currentUser = await this.usersService.findById(userId);
		}
		// return
		return handler.handle();
	}
}
