import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "guards/guards.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";

import { VersionDto, VersionCreateUpdateDto } from "./version.dto";
import { VersionService } from "./versions.service";

@ApiTags("Versions")
@Controller("version")
export class VersionController {
	constructor(private readonly versionServices: VersionService) {}
	// get latest version
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false })
	@Get("getLatest")
	async getVersion(): Promise<AppResponseDto<VersionDto>> {
		const version = await this.versionServices.findLatest();
		return appResponse(version);
	}
	// get all
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false, responseIsObject: false })
	@Get("getAllVersions")
	async getVersions(): Promise<AppResponseDto<VersionDto>> {
		const version = await this.versionServices.find();
		return appResponse(version);
	}
	// get one type
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getBy/:id")
	async getVersionById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<VersionDto>> {
		const version = await this.versionServices.findById(id);
		return appResponse(version);
	}
	// extra services
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("appVersion")
	async updateAppVersion(): Promise<AppResponseDto<VersionDto>> {
		const { appVersion: perVersion, id, ...latestVersion } = await this.versionServices.findLatest();
		Object.assign(latestVersion, { appVersion: perVersion + 1 });
		const updatedVersion = await this.versionServices.updateById(id, latestVersion);
		return appResponse(updatedVersion);
	}
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("baseVersion")
	async updateBaseVersion(): Promise<AppResponseDto<VersionDto>> {
		const { baseVersion: perVersion, id, ...latestVersion } = await this.versionServices.findLatest();
		Object.assign(latestVersion, { baseVersion: perVersion + 1 });
		const updatedVersion = await this.versionServices.updateById(id, latestVersion);
		return appResponse(updatedVersion);
	}
	// add new types
	@SwaggerDocumentaryApi(VersionCreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Post("addNew")
	async addNewBase(@Body() body: VersionCreateUpdateDto): Promise<AppResponseDto<VersionDto>> {
		const created = await this.versionServices.create(body);
		return appResponse(created, "2012");
	}
	// update pre types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Patch("updateBy/:id")
	async updateBase(
		@Param("id", ParseIntPipe) id: number,
		@Body() body: VersionCreateUpdateDto,
	): Promise<AppResponseDto<VersionDto>> {
		const updated = await this.versionServices.updateById(id, body);
		return appResponse(updated, "2013");
	}
	// delete types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Delete("deleteBy/:id")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<VersionDto>> {
		const deleted = await this.versionServices.removeById(id);
		Object.assign(deleted, { id });
		return appResponse(deleted, "2014");
	}
}
