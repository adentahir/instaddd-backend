import {
  LoginDto,
  // ResetPasswordReqDto,
  // SetPasswordDto,
  // SignupDto,
} from "@app/dtos/auth.dto"

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
// import type { LoginRequestSchema } from "@web/schemas/auth.schema"
import { UserRole } from "src/domain/entities/user/user.entity"

@ApiTags("auth")
// @Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() body: unknown,
    @Req() req: Request,
    @Query() query: unknown,
  ) {
    const dto = LoginDto.create(body).unwrap()

    const resp = await this.authService.login(dto)

    return resp
  }

  //   @HasRoles(UserRole.Issuer, UserRole.Investor)
  //   @Post("signup")
  //   async signup(
  //     @Body() body: unknown,
  //     @Req() req: Request,
  //     @Query() portal: unknown,
  //   ) {
  //     const dto = SignupDto.create(body).unwrap()
  //     const validatedQuery = ValidateQueryDto.create(portal).unwrap()
  //     return await this.authFlows.signup(dto, validatedQuery.query)
  //   }
}
