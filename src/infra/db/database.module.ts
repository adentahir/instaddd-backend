import config from "@infra/config"
import { AppLoggerProvider, PinoAppLoggerModule } from "@infra/logger"
import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { entities } from "./datasource.config"
import { REPOS } from "./typeorm/repositories"

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: config.db.DB_HOST,
      port: config.db.DB_PORT,
      username: config.db.DB_USERNAME,
      password: config.db.DB_PASSWORD,
      database: config.db.DB_NAME,
      autoLoadEntities: true,
      entities: entities,
    }),
  ],
  providers: [AppLoggerProvider, ...REPOS],
  exports: [AppLoggerProvider, ...REPOS],
})
export class DatabaseModule {}
