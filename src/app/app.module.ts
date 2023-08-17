import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { Controller, Injectable, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { AppExceptionsFilter } from "../utils/exception.filter";
import { HttpCacheInterceptor, TimeoutInterceptor } from "./app.interceptor";

import { LoggerModule } from "modules/log/logger.module";

import { Bases } from "modules/base/base.entity";
import { BasesModule } from "modules/base/bases.module";

import { Upload } from "modules/upload/upload.entity";
import { UploadModule } from "modules/upload/uploads.module";

import { Users } from "modules/user/user.entity";
import { UsersModule } from "modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			// load: [configuration],
			// expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
				type: "postgres",
				synchronize: true,
				host: config.get<string>("DB_HOST"),
				port: config.get<number>("DB_PORT"),
				username: config.get<string>("DB_USER"),
				password: config.get<string>("DB_PASS"),
				// app entities
				entities: [Bases, Upload, Users],
			}),
		}),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService): JwtModuleOptions => ({
				global: true,
				secret: config.get<string>("JWT_KEY"),
				signOptions: { expiresIn: "1d" },
			}),
		}),
		CacheModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				ttl: +config.get<number>("CACHE_TTL"),
				max: +config.get<number>("CACHE_MAX"),
			}),
		}),
		// MulterModule.registerAsync({
		// 	inject: [ConfigService],
		// 	useFactory: (config: ConfigService) => ({
		// 		storage: diskStorage({
		// 			destination: config.get<string>("FILE_DEST"),
		// 			filename: multerFilename,
		// 		}),
		// 	}),
		// }),
		ScheduleModule.forRoot(),
		// app modules
		LoggerModule,
		BasesModule,
		UploadModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
		// {
		// 	provide: APP_FILTER,
		// 	useClass: AppExceptionsFilter,
		// },
		{
			provide: APP_INTERCEPTOR,
			useClass: HttpCacheInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor,
		},
	],
})
export class AppModule {}
