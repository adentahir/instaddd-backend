import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import type { FastifyReply, FastifyRequest } from "fastify"

@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<FastifyRequest>()
    const authHeader = req.headers.authorization || ""
    const b64Creds = authHeader.split(" ")[1] || ""

    if (b64Creds === "") throw new UnauthorizedException("no basic auth header")

    const [login, pass] = Buffer.from(b64Creds, "base64").toString().split(":")

    if (login !== "abc" || pass !== "strongpass") {
      const resp = ctx.getResponse<FastifyReply>()
      resp.header("WWW-Authenticate", 'Basic realm="Authentication required."')
      throw new UnauthorizedException("invalid credentials")
    }

    return true
  }
}
