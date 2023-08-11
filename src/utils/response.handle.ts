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

export const responseMessage = (statusCode: number) => {
	switch (statusCode) {
		case 2000:
			return "Success";
		case 2001:
			return "User Created";
		case 2002:
			return "User SignIn";
		case 2003:
			return "User SignUp";
		case 2004:
			return "User SignOut";
		case 2005:
			return "User Updated";
		case 2006:
			return "User Deleted";
		case 2007:
			return "Base Created";
		case 2008:
			return "Base Updated";
		default:
			return "Please Initialize Custom Message";
	}
};
