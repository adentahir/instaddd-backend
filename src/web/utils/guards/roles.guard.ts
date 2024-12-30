import { JwtService } from "@app/services"
import { AppError } from "@carbonteq/hexapp"
import { UserRepository } from "@domain/entities/user/user.respository"
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { FastifyRequest } from "fastify/types/request"
import { IS_PUBLIC_KEY } from "../decorators/public.decorators"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userRepo: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      // 💡 See this condition
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException("No token found")
    }

    const payload = await this.jwtService.verify(token)
    // Fetch user using the userId extracted from payload. Validate if user exists in our db and throw appropriate errors.
    const user = await payload.data?.email
    if (payload.error) throw payload.error

    request.user = user
    return true
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const authHeader = request.headers.authorization
    if (!authHeader) {
      return undefined
    }

    const [type, token] = authHeader.split(" ")
    return type === "Bearer" ? token : undefined
  }
}
