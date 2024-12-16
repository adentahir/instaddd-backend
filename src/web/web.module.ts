import { AppModule } from "@infra/di/index"
import { type MiddlewareConsumer, Module } from "@nestjs/common"
import { HealthController } from "./controllers/health/health.controller"

@Module({
  imports: [AppModule],
  providers: [],
  controllers: [HealthController],
})
export class WebModule {
  configure(consumer: MiddlewareConsumer) {}
}
