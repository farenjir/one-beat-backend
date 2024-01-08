import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { Serialize } from "global/serialize.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";
import { AppGuards, Role } from "global/guards.decorator";

import { PackagesService } from "./packages.service";
import { PackageDto, CreateUpdatePackageDto, PackageQuery, PackagesQuery } from "./package.dto";

@ApiTags("Packages")
@Controller("package")
@Serialize(PackageDto)
export class PackagesController {
	constructor(private readonly packageServices: PackagesService) {}
	// get all
	@SwaggerDocumentaryApi(PackageDto, { response: ResEnum.ArrayWithCount, useAuth: false })
	@Get("all")
	@ResponseMessage("", "", ResEnum.ArrayWithCount)
	async getPackages(@Query() queryParams: PackagesQuery): Promise<[PackageDto[], number]> {
		return await this.packageServices.findAll(queryParams);
	}
	// find by Query
	@SwaggerDocumentaryApi(PackageDto, { useAuth: false })
	@Get("getPackage")
	@ResponseMessage("")
	async getProducerPackages(@Query() queryParams: PackageQuery): Promise<PackageDto> {
		return await this.packageServices.findOne(queryParams);
	}
	// add new
	@SwaggerDocumentaryApi(CreateUpdatePackageDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Post("addPackage")
	@ResponseMessage("2020")
	async addNewBase(@Req() req: Request, @Body() body: CreateUpdatePackageDto): Promise<PackageDto> {
		return await this.packageServices.createOne(body, req);
	}
	// update
	@SwaggerDocumentaryApi(CreateUpdatePackageDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Put("updateBy/:packageId")
	@ResponseMessage("2021")
	async updateBase(
		@Req() req: Request,
		@Param("packageId", ParseIntPipe) id: number,
		@Body() body: CreateUpdatePackageDto,
	): Promise<PackageDto> {
		return await this.packageServices.updateOne(id, body, req);
	}
	// delete
	@SwaggerDocumentaryApi(CreateUpdatePackageDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Delete("deleteBy/:packageId")
	@ResponseMessage("2022")
	async deleteBase(@Req() req: Request, @Param("packageId", ParseIntPipe) id: number): Promise<CreateUpdatePackageDto> {
		return await this.packageServices.deleteOne(id, req);
	}
}
