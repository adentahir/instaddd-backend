import { LoginDto, SignUpDto } from "@app/dtos/auth.dto"

import { AuthService } from "@app/services/auth.service"
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  forwardRef,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Public } from "@web/utils/decorators/public.decorators"

@Public()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: unknown) {
    const dto = LoginDto.create(body).unwrap()

    const resp = await this.authService.login(dto)

    return resp
  }

  @Post("signup")
  async signup(@Body() body: unknown, @Req() req: Request) {
    const dto = SignUpDto.create(body).unwrap()
    return await this.authService.signup(dto)
  }
}
