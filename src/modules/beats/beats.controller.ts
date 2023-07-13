import { Controller, Post, Body, UseGuards, Patch, Param } from "@nestjs/common";

import { CurrentUser } from "decorators/user.decorator";
import { Serialize } from "interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { AdminGuard } from "guards/admin.guard";

import { User } from "../users/user.entity";

import { BeatsService } from "./beats.service";
import { ApproveBeatDto, CreateBeatDto, BeatDto } from "./beats.dto";

@Controller("beats")
export class BeatsController {
	constructor(private beatsService: BeatsService) {}
	// createBeat
	@Post()
	@UseGuards(AuthGuard)
	@Serialize(BeatDto)
	createBeat(@Body() body: CreateBeatDto, @CurrentUser() user: User) {
		return this.beatsService.create(body, user);
	}
	// approveBeat
	@Patch("/:id")
	@UseGuards(AdminGuard)
	approveBeat(@Param("id") id: string, @Body() body: ApproveBeatDto) {
		return this.beatsService.changeApproval(id, body.approved);
	}
}
