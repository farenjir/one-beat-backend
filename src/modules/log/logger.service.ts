import { Injectable, Scope, Logger } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
	constructor() {
		super();
	}

	log(message: any, context?: string) {
		super.log(message, context);
		// Add your custom logger implementation here
	}

	error(message: any, trace?: string, context?: string) {
		super.error(message, trace, context);
		// Add your custom logger implementation here
	}

	warn(message: any, context?: string) {
		super.warn(message, context);
		// Add your custom logger implementation here
	}

	debug(message: any, context?: string) {
		super.debug(message, context);
		// Add your custom logger implementation here
	}
}
