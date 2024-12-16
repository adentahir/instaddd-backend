import { Controller, Get } from "@nestjs/common"
import { Public } from "@web/utils/decorators/public.decorators"

@Public()
@Controller("/api/health")
export class HealthController {
  @Get()
  async health() {
    return { up: true }
  }
}
