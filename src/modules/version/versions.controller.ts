import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { AppResponse } from "global/response.decorator";

import { VersionService } from "./versions.service";
import { VersionDto, VersionCreateUpdateDto } from "./version.dto";

@ApiTags("Versions")
@Controller("version")
export class VersionController {
	constructor(private readonly versionServices: VersionService) {}
	// get latest version
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false })
	@Get("getLatest")
	@AppResponse("")
	async getVersion(): Promise<VersionDto> {
		return await this.versionServices.findLatest();
	}
	// get all
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false, responseIsObject: false })
	@Get("getAllVersions")
	@AppResponse("")
	async getVersions(): Promise<VersionDto[]> {
		return await this.versionServices.find();
	}
	// get one type
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getBy/:id")
	@AppResponse("")
	async getVersionById(@Param("id", ParseIntPipe) id: number): Promise<VersionDto> {
		return await this.versionServices.findById(id);
	}
	// extra services
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("appVersion")
	@AppResponse("2013")
	async updateAppVersion(): Promise<VersionDto> {
		const { appVersion: perVersion, id, ...latestVersion } = await this.versionServices.findLatest();
		Object.assign(latestVersion, { appVersion: perVersion + 1 });
		return await this.versionServices.updateById(id, latestVersion); // appVersion updated
	}
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("baseVersion")
	@AppResponse("2013")
	async updateBaseVersion(): Promise<VersionDto> {
		const { baseVersion: perVersion, id, ...latestVersion } = await this.versionServices.findLatest();
		Object.assign(latestVersion, { baseVersion: perVersion + 1 });
		return await this.versionServices.updateById(id, latestVersion); // baseVersion updated
	}
	// add new types
	@SwaggerDocumentaryApi(VersionCreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Post("addNew")
	@AppResponse("2012")
	async addNewBase(@Body() body: VersionCreateUpdateDto): Promise<VersionDto> {
		return await this.versionServices.create(body);
	}
	// update pre types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Patch("updateBy/:id")
	@AppResponse("2013")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: VersionCreateUpdateDto): Promise<VersionDto> {
		return await this.versionServices.updateById(id, body);
	}
	// delete types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Delete("deleteBy/:id")
	@AppResponse("2014")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<VersionDto> {
		return await this.versionServices.removeById(id);
	}
}
