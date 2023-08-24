import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AppGuards, Role } from "guards/guards.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";

import { VersionDto, VersionCreateUpdateDto } from "./version.dto";
import { BaseService } from "./versions.service";

@ApiTags("Versions")
@Controller("version")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get latest version
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false })
	@Get("getLatest")
	async getVersion(): Promise<AppResponseDto<VersionDto>> {
		const base = await this.typeService.findLatest();
		return appResponse(base);
	}
	// get all
	@SwaggerDocumentaryApi(VersionDto, { useAuth: false, responseIsObject: false })
	@Get("getAllVersions")
	async getVersions(): Promise<AppResponseDto<VersionDto>> {
		const base = await this.typeService.find();
		return appResponse(base);
	}
	// get one type
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("getBy/:id")
	async getVersionById(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<VersionDto>> {
		const base = await this.typeService.findById(id);
		return appResponse(base);
	}
	// extra services
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("appVersion")
	async updateAppVersion(): Promise<AppResponseDto<VersionDto>> {
		const { appVersion: perVersion, id, ...latestVersion } = await this.typeService.findLatest();
		Object.assign(latestVersion, { appVersion: perVersion + 1 });
		const updatedVersion = await this.typeService.updateById(id, latestVersion);
		return appResponse(updatedVersion);
	}
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Get("baseVersion")
	async updateBaseVersion(): Promise<AppResponseDto<VersionDto>> {
		const { baseVersion: perVersion, id, ...latestVersion } = await this.typeService.findLatest();
		Object.assign(latestVersion, { baseVersion: perVersion + 1 });
		const updatedVersion = await this.typeService.updateById(id, latestVersion);
		return appResponse(updatedVersion);
	}
	// add new types
	@SwaggerDocumentaryApi(VersionCreateUpdateDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Post("addNew")
	async addNewBase(@Body() body: VersionCreateUpdateDto): Promise<AppResponseDto<VersionDto>> {
		const created = await this.typeService.create(body);
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
		const updated = await this.typeService.updateById(id, body);
		return appResponse(updated, "2013");
	}
	// delete types
	@SwaggerDocumentaryApi(VersionDto)
	@AppGuards(Role.Admin, Role.Editor)
	@Delete("deleteBy/:id")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<AppResponseDto<VersionDto>> {
		const deleted = await this.typeService.removeById(id);
		Object.assign(deleted, { id });
		return appResponse(deleted, "2014");
	}
}
