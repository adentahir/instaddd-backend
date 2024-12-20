import { DateTime, UUID } from "@carbonteq/hexapp"

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
