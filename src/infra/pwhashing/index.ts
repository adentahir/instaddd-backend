import { PwHashingService } from "@app/services/pw-hashing.service"
import { InvalidCredentials } from "@domain/entities/user/user.errors"
import config from "@infra/config"
import type { Provider } from "@nestjs/common"
import * as nodeArgon2 from "@node-rs/argon2"
import { ValidationResult } from "@shared/utils"

export class ArgonPwHasher extends PwHashingService {
  private readonly SECRET: Buffer

  constructor() {
    super()

    this.SECRET = Buffer.from(config.auth.PWD_HASH_SECRET, "hex")
  }

  hash(plain: string): string {
    return nodeArgon2.hashSync(plain, {
      secret: this.SECRET,
    })
  }

  compare(
    plain: string,
    hashed: string,
  ): ValidationResult<null, InvalidCredentials> {
    const isValid = nodeArgon2.verifySync(hashed, plain, {
      secret: this.SECRET,
    })

    return isValid
      ? { success: true, data: null }
      : { success: false, error: new InvalidCredentials() }
  }
}

export const HashingServiceProvider: Provider<PwHashingService> = {
  provide: PwHashingService,
  useClass: ArgonPwHasher,
}
