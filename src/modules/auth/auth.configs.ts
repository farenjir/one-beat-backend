import { scrypt, randomBytes } from "crypto";

export async function handleHashPassword(password: string, salt: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		scrypt(password, salt, 32, (err, derivedKey) => {
			if (err) {
				reject(err);
			} else {
				resolve(derivedKey.toString("hex"));
			}
		});
	});
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const hash = await handleHashPassword(password, salt);
	// hashedPassword
	return `${salt}.${hash}`;
}

export const cookieOptions = {
	path: "/",
	maxAge: 24 * 24 * 3600,
	httpOnly: true,
	secure: true,
};
