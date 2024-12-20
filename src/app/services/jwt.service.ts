import { UnauthorizedException } from "@nestjs/common"
import { ValidationResult } from "@shared/utils"
import type { UserRole } from "../../domain/entities/user/user.entity"

export interface JwtPayload {
  email: string
  role: UserRole
}

export class InvalidToken extends UnauthorizedException {
  constructor() {
    super("Invalid/Expired token")
  }
}

export abstract class JwtService {
  abstract sign(payload: JwtPayload): Promise<string>
  abstract verify(
    token: string,
  ): Promise<ValidationResult<JwtPayload, InvalidToken>>
}
