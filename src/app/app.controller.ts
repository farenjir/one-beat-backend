import { Controller } from "@nestjs/common";

@Controller()
export class AppController {
	getTest() {
		return "TEST_AppController";
	}
}
