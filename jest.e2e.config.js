module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coverageDirectory: "coverage",
	// root
	rootDir: "./src",
	modulePaths: ["<rootDir>"],
	// schema
	moduleFileExtensions: ["js", "json", "ejs", "ts"],
	testRegex: "(/__tests__/*|(\\.|/)(e2e.test))\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
};
