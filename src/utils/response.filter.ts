import { ApiProperty } from "@nestjs/swagger";

export class AppResponseDto<TData> {
	@ApiProperty()
	code: number;
	@ApiProperty()
	message: string;
	@ApiProperty()
	description: string;
	@ApiProperty()
	timestamp: string;
	// TData
	result: TData[] | TData;
}

export const appResponse = <T>(result: T | T[], code = "2000", descriptionCode = ""): AppResponseDto<T> => ({
	code: Number(code),
	message: responseMessage(code),
	description: descriptionMessage(descriptionCode),
	timestamp: new Date().toISOString(),
	result,
});

const responseMessage = (statusCode: string) => {
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
		2012: "Version Added",
		2013: "Version Updated",
		2014: "Version Deleted",
	};
	// return
	return messages[statusCode] || statusCode;
};

const descriptionMessage = (descriptionCode: string) => {
	const messages = {};
	// return
	return messages[descriptionCode] || descriptionCode;
};
