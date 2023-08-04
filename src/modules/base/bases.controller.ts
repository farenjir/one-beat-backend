import {
	Body,
	Controller,
	Delete,
	Get,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	ParseArrayPipe,
	UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags, ApiQuery } from "@nestjs/swagger";

import { Serialize } from "utils/interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Roles } from "guards/role/roles.decorator";
import { Role } from "guards/role/role.enum";

import { CreateBaseDto, BaseDto, UpdateBaseDto, BaseQueries } from "./base.dto";
import { ValidationQueryPipe } from "./base.pipe";
import { BaseService } from "./bases.service";

@ApiTags("Bases")
@Controller("base")
export class BaseController {
	constructor(private readonly typeService: BaseService) {}
	// get all types
	@ApiOkResponse({ type: BaseDto })
	@Get("getAll")
	async getBases(): Promise<BaseDto[]> {
		return await this.typeService.findBases();
	}
	// get one type
	@ApiOkResponse({ type: BaseDto })
	@ApiQuery({
		name: "baseId",
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: "type",
		required: false,
		type: String,
	})
	@Get("getBase")
	async getBase(@Query(new ValidationQueryPipe()) query: BaseQueries = {}): Promise<BaseDto> {
		const { baseId, type } = query;
		return await this.typeService.findBase(baseId, type);
	}
	// get children of type
	@ApiOkResponse({ type: [BaseDto] })
	@ApiQuery({
		name: "parentId",
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: "type",
		required: false,
		type: String,
	})
	@Get("getBaseChildren")
	async getChildrenOfParent(@Query(new ValidationQueryPipe()) query: BaseQueries = {}): Promise<BaseDto[]> {
		const { parentId, type } = query;
		return await this.typeService.findBaseChildren(parentId, type);
	}
	// add new types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Post("addNewBase")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async addNewBase(@Body() body: CreateBaseDto): Promise<BaseDto> {
		return await this.typeService.create(body);
	}
	// update pre types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Patch("updateById")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateBase(@Query("id", ParseIntPipe) id: number, @Body() body: UpdateBaseDto): Promise<BaseDto> {
		return await this.typeService.updateById(id, body);
	}
	// delete types
	@ApiCookieAuth()
	@ApiOkResponse({ type: BaseDto })
	@Delete("deleteById")
	// @Roles(Role.Admin)
	// @UseGuards(AuthGuard, RolesGuard)
	async deleteBase(@Query("id", ParseIntPipe) id: number): Promise<BaseDto> {
		const typeRemoved = await this.typeService.removeById(id);
		return { id, ...typeRemoved };
	}
}
