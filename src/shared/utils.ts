import { PaginationDto } from "@app/dtos/pagnation.dto"
import { DateTime, PaginationOptions, UUID } from "@carbonteq/hexapp"

export type ValidationResult<T, E = string> = {
  success: boolean
  data?: T
  error?: E
}

export type Omitt<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IEntity {
  readonly id: UUID
  readonly createdAt: DateTime
  readonly updatedAt: DateTime
}
export interface SerializedEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export const toPaginated = <T>(
  data: T,
  opts: PaginationDto,
  total: number,
) => ({
  data,
  pageNum: opts.pageNum,
  pageSize: opts.pageSize,
  totalPages: Math.ceil(total / opts.pageSize),
})

export interface Paginated<T> {
  data: T
  readonly pageNum: number
  readonly pageSize: number
  readonly totalPages: number
}
