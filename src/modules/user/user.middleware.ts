import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { Session } from "express-session";

import { User } from "./user.entity";
import { UsersService } from "./user.service";

declare module "express" {
	interface Request {
		currentUser?: User;
	}
}
interface SessionWithUserId extends Session {
	userId?: number;
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
	constructor(private readonly usersService: UsersService) {}
	// use
	async use(req: Request, _res: Response, next: NextFunction) {
		const { userId } = (req.session as SessionWithUserId) ?? {};
		if (userId) {
			req.currentUser = await this.usersService.findById(userId);
		}
		// next
		next();
	}
}
