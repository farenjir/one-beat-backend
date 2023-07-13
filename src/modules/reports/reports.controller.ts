import { Controller, Post, Body, UseGuards, Patch, Param, Get, Query } from "@nestjs/common";

import { CurrentUser } from "../../decorators/user.decorator";
import { User } from "../users/user.entity";

import { Serialize } from "interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { AdminGuard } from "guards/admin.guard";

import { ReportsService } from "./reports.service";
import { ApproveReportDto, CreateReportDto, GetEstimateDto, ReportDto } from "./report.dto";


@Controller("reports")
export class ReportsController {
	constructor(private reportsService: ReportsService) {}
	// getEstimate
	@Get()
	getEstimate(@Query() query: GetEstimateDto) {
		return this.reportsService.createEstimate(query);
	}
	// createReport
	@Post()
	@UseGuards(AuthGuard)
	@Serialize(ReportDto)
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportsService.create(body, user);
	}
	// approveReport
	@Patch("/:id")
	@UseGuards(AdminGuard)
	approveReport(@Param("id") id: string, @Body() body: ApproveReportDto) {
		return this.reportsService.changeApproval(id, body.approved);
	}
}
