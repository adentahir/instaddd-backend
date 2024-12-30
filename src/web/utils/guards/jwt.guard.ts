import { AuthService, JwtService } from "@app/services"
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { FastifyRequest } from "fastify"
import { HttpResponse } from "../interceptors/app-result.adapter.http"

export const IS_PUBLIC_KEY = "isPublic"
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtServ: JwtService,
    private readonly authServ: AuthService,
    private readonly reflector: Reflector,
  ) {}

  private static extractTokenFromHeader(
    request: FastifyRequest,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? []
    return type === "Bearer" ? token : undefined
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<FastifyRequest>()
    const token = JwtGuard.extractTokenFromHeader(req)

    if (!token) throw new UnauthorizedException("Bearer token not found")

    const decodeRes = await this.jwtServ.verify(token)
    if (!decodeRes.success) throw new UnauthorizedException(decodeRes.error)

    return true
  }
}
