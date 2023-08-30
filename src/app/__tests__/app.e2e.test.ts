import { Test } from "@nestjs/testing";

import { AppModule } from "../app.module";
import { AppController } from "../app.controller";
import { AppService } from "../app.service";

describe("AppModule", () => {
	let appController: AppController;
	let appService: AppService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		// modules
		appController = moduleRef.get<AppController>(AppController);
		appService = moduleRef.get<AppService>(AppService);
	});

	describe("AppController", () => {
		describe("controller", () => {
			it("should return TEST_AppController", (done) => {
				expect(appController.getTest()).toBe("TEST_AppController");
				done();
			});
		});
	});

	describe("AppService", () => {
		describe("service", () => {
			it("should return TEST_AppService", (done) => {
				expect(appService.getTest()).toBe("TEST_AppService");
				done();
			});
		});
	});
});
