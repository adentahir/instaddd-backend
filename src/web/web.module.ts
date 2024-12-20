import { DatabaseModule } from "@infra/db/database.module"
import { AppModule, BaseDiModule } from "@infra/di/index"
import { type MiddlewareConsumer, Module } from "@nestjs/common"
import { AuthController } from "./controllers/auth/auth.controller"
import { HealthController } from "./controllers/health/health.controller"

@Module({
  imports: [AppModule, DatabaseModule],
  providers: [],
  controllers: [HealthController, AuthController],
})
export class WebModule {
  configure(consumer: MiddlewareConsumer) {}
}
