export interface IResponse {
	code: number;
	message?: string;
	description?: string;
	data?: any;
	timestamp: string;
}

export const responseHandler = (data?: any, code = 2000, message?: string, description?: string): IResponse => {
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
		default:
			return "Please Initialize Custom Message";
	}
};
