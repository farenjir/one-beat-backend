import { Body, Controller, Delete, Get, ParseIntPipe, Put, Post, Query, Param } from "@nestjs/common";
import { Timeout } from "@nestjs/schedule";
import { ApiTags } from "@nestjs/swagger";

import { Serialize } from "global/serialize.decorator";
import { AppGuards, Role } from "global/guards.decorator";
import { ResEnum, SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { BaseService } from "./bases.service";
import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQuery, BasesQuery, BaseIgnoredDto } from "./base.dto";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly baseService: BaseService) {}
	// get all types
	@SwaggerDocumentaryApi(BaseDto, { response: ResEnum.Array, useAuth: false })
	@Get("all")
	@ResponseMessage("")
	async getBases(): Promise<BaseDto[]> {
		return await this.baseService.findAll();
	}
	// get one type
	@SwaggerDocumentaryApi(BaseDto, { useAuth: false })
	@Get("getBase")
	@ResponseMessage("")
	async getBase(@Query() queryParams: BaseQuery): Promise<BaseDto> {
		return await this.baseService.findOne(queryParams);
	}
	// get children of type
	@SwaggerDocumentaryApi(BaseDto, {
		response: ResEnum.Array,
		useAuth: false,
		description: "get Children of one base with parent id or type",
	})
	@Serialize(BaseIgnoredDto)
	@Get("getBases")
	@ResponseMessage("")
	async getChildrenOfParent(@Query() queryParams: BasesQuery): Promise<BaseDto[]> {
		return await this.baseService.findBaseChildren(queryParams);
	}
	// add new types
	@SwaggerDocumentaryApi(CreateBaseDto, {
		description: "Create a new Base with ( parentId : 0 ) and Create a new Child with ( target Base parentId )",
	})
	@AppGuards(Role.Admin)
	@Post("addBase")
	@ResponseMessage("2007")
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.baseService.createOne(body);
	}
	// update pre types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Put("updateBy/:id")
	@ResponseMessage("2008")
	async updateBase(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<BaseDto> {
		return await this.baseService.updateById(id, body);
	}
	// delete types
	@SwaggerDocumentaryApi(BaseDto)
	@AppGuards(Role.Admin)
	@Delete("deleteBy/:id")
	@ResponseMessage("2008")
	async deleteBase(@Param("id", ParseIntPipe) id: number): Promise<BaseDto> {
		return await this.baseService.removeById(id);
	}
	// *** schedule to make default bases ***
	@Timeout("INIT_BASES", 5000)
	// @Cron(CronExpression.EVERY_WEEKEND, { name: "INIT_BASES",timeZone:"Iran/Tehran" })
	scheduleToDefaultBases() {
		return this.baseService.scheduleDefaultBases();
	}
}
