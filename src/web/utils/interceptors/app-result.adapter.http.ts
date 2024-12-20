import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common"
import { ValidationResult } from "@shared/utils"

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class HttpResponse {
  private static processError<T, E>(result: ValidationResult<T, E>): never {
    const errMsg = result.error || "Unknown error occurred"

    switch (result.error) {
      case "NotFound":
        throw new NotFoundException(errMsg)
      case "InvalidData":
        throw new UnprocessableEntityException(errMsg)
      case "Unauthorized":
        throw new UnauthorizedException(errMsg)
      case "AlreadyExists":
        throw new ConflictException(errMsg)
      case "InvalidOperation":
        throw new BadRequestException(errMsg)
      case "Generic":
        throw new InternalServerErrorException(errMsg)
      default:
        throw new NotImplementedException(`Unhandled error type: "${errMsg}"`)
    }
  }

  static handleValidationResult<T, E = string>(
    result: ValidationResult<T, E>,
  ): T {
    if (!result.success) {
      // biome-ignore lint/complexity/noThisInStatic: <explanation>
      this.processError(result)
    }
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    return result.data!
  }

  static handleError(err: unknown): never {
    if (err instanceof Error) {
      throw new InternalServerErrorException(err.message, { cause: err })
    }
    throw new InternalServerErrorException("An unexpected error occurred.")
  }
}
