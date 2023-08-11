export interface IAppResponse {
	code?: number | string;
	message?: string;
	description?: string;
	data?: any;
	timestamp?: string;
}

type Code = number | string;

export const appResponse = (data?: any, code?: Code, descriptionCode?: Code): IAppResponse => {
	return {
		code,
		message: responseMessage(code),
		description: descriptionMessage(descriptionCode),
		timestamp: new Date().toISOString(),
		data,
	};
};

export const responseMessage = (statusCode: Code) => {
	const messages = {
		2001: "User Created",
		2002: "User SignIn",
		2003: "User SignUp",
		2004: "User SignOut",
		2005: "User Updated",
		2006: "User Deleted",
		2007: "Base Created",
		2008: "Base Updated",
		default: "Succeed",
	};
	// return
	return messages[statusCode] || messages.default;
};

export const descriptionMessage = (descriptionCode: Code) => {
	const messages = {};
	// return
	return messages[descriptionCode] || "";
};
