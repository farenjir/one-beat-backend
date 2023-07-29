export const globalKeys = {
	tokenKey: "app-token",
	roleKey: "roles",
};

export const cookieOptions = {
	path: "/",
	httpOnly: true,
	maxAge: 24 * 24 * 3600,
	secure: process.env.NODE_ENV === "production",
};
