module.exports = {
	moduleFileExtensions: ["js", "json", "ts"],
	testEnvironment: "node",
	// root
	rootDir: "./src",
	modulePaths: ["<rootDir>"],
	// schema
	testRegex: "(/__tests__/*|(\\.|/)(e2e.test))\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
};
