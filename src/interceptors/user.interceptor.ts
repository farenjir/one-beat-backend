import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { UsersService } from "../modules/users/users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private usersService: UsersService) {}
	// intercept
	async intercept(context: ExecutionContext, handler: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const { userId } = request.session || {};
		if (userId) {
			const user = await this.usersService.findOne(userId);
			request.currentUser = user;
		}
		// return
		return handler.handle();
	}
}
