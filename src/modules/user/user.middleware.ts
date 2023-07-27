import { Request, Response, NextFunction } from "express";

import { UsersService } from "./user.service";
import { User } from "./user.entity";

declare module "express" {
	interface Request {
		currentUser?: User;
	}
}
export class CurrentUserMiddleware {
	constructor(private usersService: UsersService) {}
	// use
	async use(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.session ?? {};
		if (userId) {
			req.currentUser = await this.usersService.findById(userId);
		}
		// next
		next();
	}
}
