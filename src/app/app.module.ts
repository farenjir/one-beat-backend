import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";

import { AppExceptionsFilter } from "utils/filters/exception.filter";
import { CustomDBLoggerOnTypeORM } from "utils/logs/db.logger";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import {
	AppLoggingInterceptor,
	AppResponseInterceptor,
	HttpCacheInterceptor,
	SerializeDataInterceptor,
	TimeoutInterceptor,
} from "./app.interceptor";

import { Bases } from "modules/base/base.entity";
import { BasesModule } from "modules/base/bases.module";

import { Tags } from "modules/tag/tag.entity";
import { TagsModule } from "modules/tag/tags.module";

import { Version } from "modules/version/version.entity";
import { VersionModule } from "modules/version/versions.module";

import { AuthModule } from "modules/auth/auth.module";
import { UsersModule } from "modules/user/users.module";
import { Users } from "modules/user/user.entity";
import { Profile } from "modules/user/profile/profile.entity";
import { UserKYC } from "modules/user/kyc/kyc.entity";

import { Upload } from "modules/upload/upload.entity";
import { UploadModule } from "modules/upload/uploads.module";

import { Products } from "modules/product/product.entity";
import { ProductModule } from "modules/product/products.module";

import { Blogs } from "modules/blog/blog.entity";
import { BlogsModule } from "modules/blog/blogs.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			// expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
				type: "postgres",
				host: config.get<string>("DB_HOST"),
				port: +config.get<number>("DB_PORT"),
				username: config.get<string>("DB_USER"),
				password: config.get<string>("DB_PASS"),
				synchronize: true,
				// autoLoadEntities: true,
				logger: new CustomDBLoggerOnTypeORM(),
				// app entities join(__dirname, "../modules/**/*.entity.ts")
				entities: [Bases, Tags, Version, Upload, Users, Profile, UserKYC, Products, Blogs],
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
		ScheduleModule.forRoot(),
		// app modules
		BasesModule,
		TagsModule,
		VersionModule,
		UploadModule,
		AuthModule,
		UsersModule,
		ProductModule,
		BlogsModule,
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
		{
			provide: APP_FILTER,
			useClass: AppExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppLoggingInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppResponseInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: SerializeDataInterceptor,
		},
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
