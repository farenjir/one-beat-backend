import { join } from "path";
import { rm } from "fs/promises";
import { getConnection } from "typeorm";

global.beforeEach(async () => {
	try {
		await rm(join(__dirname, "..", "test.sqlite"));
	} catch (err) {}
});

global.afterEach(async () => {
	const conn = getConnection();
	await conn.close();
});
