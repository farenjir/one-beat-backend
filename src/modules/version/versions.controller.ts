import { Body, Controller, Delete, Get, ParseIntPipe, Put, Post, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "global/guards.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { VersionService } from "./versions.service";
import { VersionDto, VersionCreateUpdateDto, VersionQuery } from "./version.dto";

@ApiTags("Versions")
@Controller("version")
export class VersionController {
	constructor(private readonly versionServices: VersionService) {}
	// get all
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false, response: ResEnum.Array })
	@Get("all")
	@ResponseMessage("")
	async getVersions(): Promise<VersionDto[]> {
		return await this.versionServices.find();
	}
	// get latest version
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false })
	@Get("latest")
	@ResponseMessage("")
	async getVersion(): Promise<VersionDto> {
		return await this.versionServices.findLatest(true);
	}
	// extra services
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("update")
	@ResponseMessage("2013")
	async updateBaseVersion(@Query() { type }: VersionQuery): Promise<VersionDto> {
		return await this.versionServices.updateVersion({ type });
	}
	// add new types
	@SwaggerDocumentaryApi(VersionCreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Post("addNew")
	@ResponseMessage("2012")
	async addNewBase(@Body() body: VersionCreateUpdateDto): Promise<VersionDto> {
		return await this.versionServices.create(body);
	}
	// get one type
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getBy/:id")
	@ResponseMessage("")
	async getVersionById(@Param("id", ParseIntPipe) id: number): Promise<VersionDto> {
		return await this.versionServices.findById(id);
	}
	// update pre types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Put("updateBy/:id")
	@ResponseMessage("2013")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: VersionCreateUpdateDto): Promise<VersionDto> {
		return await this.versionServices.updateById(id, body);
	}
	// delete types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Delete("deleteBy/:id")
	@ResponseMessage("2014")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<VersionDto> {
		return await this.versionServices.removeById(id);
	}
}
