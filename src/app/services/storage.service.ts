import { ValidationResult } from "@shared/utils"

export class StorageServiceError extends Error {}

export abstract class StorageService {
  abstract add(data: Buffer): Promise<{ url: string }>
  abstract remove(
    url: string,
  ): Promise<ValidationResult<null, StorageServiceError>>
}
