// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { Request, Response, NextFunction } from "express";
// import { Session } from "express-session";

// import { Users } from "../user.entity";
// import { UsersService } from "../user.service";

// declare module "express" {
// 	interface Request {
// 		currentUser?: Users;
// 	}
// }
// interface SessionWithUserId extends Session {
// 	userId?: number;
// }
// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
// 	constructor(private readonly usersService: UsersService) {}
// 	// use
// 	async use(req: Request, _res: Response, next: NextFunction) {
// 		const { userId } = (req.session as SessionWithUserId) ?? {};
// 		if (userId) {
// 			req.currentUser = await this.usersService.findBy({id:userId});
// 		}
// 		// next
// 		next();
// 	}
// }
// export class UsersModule implements NestModule {
// 	configure(consumer: MiddlewareConsumer) {
// 		consumer.apply(CurrentUserMiddleware).forRoutes("*");
// 	}
// }
