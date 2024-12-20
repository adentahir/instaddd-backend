import { AuthService } from "@app/services/auth.service"
import { DatabaseModule } from "@infra/db/database.module"
import { JwtServProvider } from "@infra/jwt"
import { PinoAppLoggerModule } from "@infra/logger"
import { HashingServiceProvider } from "@infra/pwhashing"
import { Global, Module } from "@nestjs/common"

// Stuff like Redis, Elasticsearch
const BASE_SERVICES = [HashingServiceProvider, JwtServProvider]

@Global()
@Module({
  imports: [PinoAppLoggerModule],
  providers: BASE_SERVICES,
  exports: BASE_SERVICES,
})
export class BaseDiModule {}

const DOMAIN_SERVICES = []
@Global()
@Module({
  imports: [BaseDiModule, DatabaseModule],
  providers: DOMAIN_SERVICES,
  exports: DOMAIN_SERVICES,
})
class DomainServicesModule {}

//app services module
const APP_SERVICES = [AuthService]

@Global()
@Module({
  imports: [BaseDiModule, DomainServicesModule, DatabaseModule],
  providers: APP_SERVICES,
  exports: APP_SERVICES,
})
class AppServiceModule {}

//workflow module
const WORKFLOWS = []

@Global()
@Module({
  imports: [BaseDiModule, AppServiceModule],
  providers: WORKFLOWS,
  exports: WORKFLOWS,
})
class WorkflowModule {}

//root module/app module //not globallll
@Module({
  imports: [BaseDiModule, AppServiceModule, WorkflowModule],
})
export class AppModule {}
