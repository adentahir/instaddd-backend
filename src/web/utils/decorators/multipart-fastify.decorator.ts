import { MultipartFile } from "@fastify/multipart"
import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from "@nestjs/common"
import { FastifyRequest } from "fastify"

export interface MultipartFastifyData {
  file: MultipartFile
  data: Record<string, unknown>
}

export const MultipartFastify = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): MultipartFastifyData => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>()
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const body = req.body as Record<string, { value: any }>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const file = (req.body as any).file

    if (!file) {
      throw new InternalServerErrorException("Expected a multipart file")
    }

    const data: MultipartFastifyData["data"] = {}
    for (const [key, val] of Object.entries(body)) {
      if (key !== "file") {
        data[key] = val.value
      }
    }

    return {
      file,
      data,
    }
  },
)
