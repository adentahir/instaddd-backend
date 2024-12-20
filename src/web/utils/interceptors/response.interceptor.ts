import { Logger } from "@carbonteq/hexapp" // Replace with your actual logger
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { ValidationResult } from "@shared/utils"
import { Observable, map } from "rxjs"
import { HttpResponse } from "./app-result.adapter.http"

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(ResponseInterceptor.name)
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map(response => {
        if (response && typeof response === "object" && "success" in response) {
          const validationResult = response as ValidationResult<unknown>
          if (!validationResult.success) {
            this.logger.error(
              validationResult.error || "Validation error occurred",
            )
          }
          return HttpResponse.handleValidationResult(validationResult)
        }

        return response
      }),
    )
  }
}
