import { type JwtPayload, JwtService } from "@app/services"
import { InvalidToken } from "@app/services/jwt.service"
import { JwtClient } from "@carbonteq/jwt"
import config from "@infra/config"
import { Injectable, type Provider } from "@nestjs/common"
import { ValidationResult } from "@shared/utils"

const INVALID_TOKEN_ERR = new InvalidToken()

@Injectable()
class JwtServiceCt extends JwtService {
  private client: JwtClient

  constructor() {
    super()

    this.client = new JwtClient(config.auth.PWD_HASH_SECRET)
  }

  async sign(payload: JwtPayload): Promise<string> {
    return this.client.sign(payload, config.auth.TOKEN_EXPIRATION_SECONDS)
  }

  async verify(
    token: string,
  ): Promise<ValidationResult<JwtPayload, InvalidToken>> {
    try {
      const claims = this.client.verify(token)

      return { success: true, data: claims.data as JwtPayload } // TODO: use zod validation here as well, probably with schema as static prop in JwtService
    } catch (err) {
      return { success: false, error: INVALID_TOKEN_ERR }
    }
  }
}

export const JwtServProvider: Provider<JwtService> = {
  provide: JwtService,
  useClass: JwtServiceCt,
}
