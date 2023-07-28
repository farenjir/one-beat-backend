import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

declare module "express" {
	interface Request {
		user?: {
			id: number;
			email: string;
		};
	}
}
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}
	// canActivate
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.cookies["app-token"];
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: "process.env.JWT_KEY",
			});
			request["user"] = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}
}
