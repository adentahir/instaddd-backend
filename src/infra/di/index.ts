import { PinoAppLoggerModule } from "@infra/logger"
import { Global, Module } from "@nestjs/common"

// Stuff like Redis, Elasticsearch
const BASE_SERVICES = []

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
  imports: [BaseDiModule],
  providers: DOMAIN_SERVICES,
  exports: DOMAIN_SERVICES,
})
class DomainServicesModule {}

//app services module
const APP_SERVICES = []

@Global()
@Module({
  imports: [BaseDiModule, DomainServicesModule],
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
