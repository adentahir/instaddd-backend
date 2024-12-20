import type {
  //   ForgotPasswordDto,
  LoginDto,
  //   ResetPasswordDto,
  //   SignUpDto,
} from "@app/dtos/auth.dto"
import { JwtService } from "@app/services"
import { PwHashingService } from "@app/services/pw-hashing.service"
import { User } from "@domain/entities/user/user.entity"
import { UserRepository } from "@domain/entities/user/user.respository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AuthService {
  constructor(
    private readonly pwHashServ: PwHashingService,
    private readonly tokenServ: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async login({ email, password }: LoginDto) {
    const userRes = await this.userRepo.fetchByEmail(email)

    // TODO: Can be simplified with a helper function
    if (userRes.success === false || userRes.data === undefined)
      return { success: false, error: userRes.error }

    const match = this.pwHashServ.compare(password, userRes.data.password)

    if (match.success === false) return { success: false, error: match.error }

    const view = this.tokenServ.sign({
      email: userRes.data.email,
      role: userRes.data.role,
    })

    return { success: true, data: view }
  }

  //   async signup({ email, password, username, baseUrl }: SignUpDto) {
  //     const pwHashed = this.pwHashServ.hash(password)

  //     const user = await this.userRepo.insert(User.new(username, email, pwHashed))

  //     const verifyReq = await user
  //       .map(VerifyRequest.forUser)
  //       .bind(req => this.verifyRequestRepo.insert(req))

  //     const _emailRes = await verifyReq.map(req =>
  //       this.emailServ.sendVerificationLink(email, baseUrl, req.id),
  //     )

  //     const loginToken = user.map(u => this.tokenServ.sign({ userId: u.id }))

  //     return AppResult.fromResult(loginToken)
  //   }

  //   async forgotPassword({ email, baseUrl }: ForgotPasswordDto) {
  //     const user = await this.userRepo.fetchByEmail(email)

  //     const resetReq = await user
  //       .map(ResetRequest.forUser)
  //       .bind(req => this.resetRequestRepo.insert(req))

  //     const _emailRes = await resetReq.map(req =>
  //       this.emailServ.sendForgotPasswordEmail(email, baseUrl, req.id),
  //     )

  //     return AppResult.Ok({
  //       message: "You'll recieve an email with the link to reset your password",
  //     })
  //   }

  async resetPassword({ reqId, newPassword }) {}
}
