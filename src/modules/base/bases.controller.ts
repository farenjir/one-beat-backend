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
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Serialize } from "utils/interceptors/serialize.interceptor";

import { AuthGuard } from "guards/auth.guard";
import { RolesGuard } from "guards/role.guard";

import { Roles } from "guards/role/roles.decorator";
import { Role } from "guards/role/role.enum";

import { CreateBaseDto, BaseDto, UpdateBaseDto } from "./base.dto";
import { ValidationPipe } from "./base.pipe";
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
	@Get("getBase")
	async getBase(
		@Query("id", new ParseIntPipe({ optional: true })) id?: number,
		@Query("type", new ValidationPipe({ optional: true })) type?: string,
	): Promise<BaseDto> {
		return await this.typeService.findBase(id, type);
	}
	// get children of type
	@ApiOkResponse({ type: BaseDto })
	@Get("getChildren")
	async getChildrenOfParent(
		@Query("parentId", new ParseIntPipe({ optional: true })) parentId?: number,
		@Query("parentType", new ValidationPipe({ optional: true })) parentType?: string,
	): Promise<BaseDto[]> {
		return await this.typeService.findBaseParent(parentId, parentType);
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
