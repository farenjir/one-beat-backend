export interface IAppResponse {
	code?: number;
	message?: string;
	description?: string;
	data?: any;
	timestamp?: string;
}

export const appResponse = (data?: any, code = 2000, message?: string, description?: string): IAppResponse => {
	return {
		code,
		message: message || responseMessage(code),
		description,
		data,
		timestamp: new Date().toISOString(),
	};
};

export const responseMessage = (statusCode: number | string) => {
	const messages = {
		2000: "Success",
		2001: "User Created",
		2002: "User SignIn",
		2003: "User SignUp",
		2004: "User SignOut",
		2005: "User Updated",
		2006: "User Deleted",
		2007: "Base Created",
		2008: "Base Updated",
		default: "Please Initialize Custom Message",
	};
	// return
	return messages[statusCode] || messages.default;
};
