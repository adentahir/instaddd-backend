import type { InvalidCredentials } from "@domain/entities/user/user.errors"
import { ValidationResult } from "@shared/utils"

export abstract class PwHashingService {
  abstract hash(plain: string): string
  abstract compare(
    plain: string,
    hashed: string,
  ): ValidationResult<null, InvalidCredentials>
}
