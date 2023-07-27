import { Module, ValidationPipe, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { User } from "modules/user/user.entity";
import { UsersModule } from "modules/user/user.module";

// eslint-disable-next-line
const cookieSession = require("cookie-session");
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			// load: [ormConfig]
			// expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: "sqlite",
					database: config.get<string>("DB_NAME"),
					// host
					// port
					// username
					// password
					synchronize: true,
					entities: [User],
				};
			},
		}),
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
	],
})
export class AppModule {
	constructor(private configService: ConfigService) {}
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					keys: [this.configService.get("COOKIE_KEY")],
				}),
			)
			.forRoutes("*");
	}
}
