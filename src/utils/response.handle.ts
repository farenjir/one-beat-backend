type Code = number | string;

export interface IAppResponse {
	code?: Code;
	message?: string;
	description?: string;
	data?: any;
	timestamp?: string;
}

export const appResponse = (data?: any, code = "2000", descriptionCode?: Code): IAppResponse => {
	return {
		code: Number(code),
		message: responseMessage(code),
		description: descriptionMessage(descriptionCode),
		timestamp: new Date().toISOString(),
		data,
	};
};

export const responseMessage = (statusCode: Code) => {
	const messages = {
		2000: "Succeed",
		2001: "User Created",
		2002: "User SignIn",
		2003: "User SignUp",
		2004: "User SignOut",
		2005: "User Updated",
		2006: "User Deleted",
		2007: "Base Created",
		2008: "Base Updated",
		2009: "File Uploaded",
		2010: "File Updated",
		2011: "File Deleted",
	};
	// return
	return messages[statusCode];
};

export const descriptionMessage = (descriptionCode: Code) => {
	const messages = {};
	// return
	return messages[descriptionCode] || "";
};
