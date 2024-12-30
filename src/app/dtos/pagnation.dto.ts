import { BaseDto, DtoValidationResult } from "@carbonteq/hexapp"
import { z } from "zod"

export class PaginationDto extends BaseDto implements PaginationDto {
  private static readonly schema = z.object({
    pageNum: z.coerce.number().positive().default(1),
    pageSize: z.coerce.number().positive().default(8),
  })

  constructor(
    readonly pageNum: number,
    readonly pageSize: number,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<PaginationDto> {
    return BaseDto.validate(PaginationDto.schema, data).map(
      ({ pageNum, pageSize }) => new PaginationDto(pageNum, pageSize),
    )
  }
}
