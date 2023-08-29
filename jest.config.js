module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	coverageDirectory: "coverage",
	// root
	rootDir: "./src",
	modulePaths: ["<rootDir>"],
	// schema
	moduleFileExtensions: ["js", "json", "ejs", "ts"],
	collectCoverageFrom: ["**/*.(t|j)s"],
	testRegex: "(/__tests__/*|(\\.|/)(spec))\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
};
