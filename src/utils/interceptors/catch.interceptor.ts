import { ExecutionContext, Injectable } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
	private readonly excludePaths: Array<string> = ["user"];
	// trackBy
	trackBy(context: ExecutionContext): string | undefined {
		const request = context.switchToHttp().getRequest();
		const { httpAdapter } = this.httpAdapterHost;
		// info
		const path = httpAdapter.getRequestUrl(request);
		const method = httpAdapter.getRequestMethod(request);
		// check conditions
		const isNotGetRequest = method !== "GET";
		const excludePath = this.excludePaths.some((ex) => path.includes(ex));
		// return
		if (excludePath || isNotGetRequest) {
			return undefined;
		} else {
			return httpAdapter.getRequestUrl(request);
		}
	}
}
