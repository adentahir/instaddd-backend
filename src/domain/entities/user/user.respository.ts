import { Email, UUID } from "@carbonteq/hexapp"
import { ValidationResult } from "@shared/utils"
import type { User } from "./user.entity"
import type { UserAlreadyExists, UserNotFound } from "./user.errors"

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class UserRepository {
  abstract fetchByEmail(
    email: Email,
  ): Promise<ValidationResult<User, UserNotFound>>

  abstract fetchById(id: UUID): Promise<ValidationResult<User, UserNotFound>>

  abstract insert(
    entity: User,
  ): Promise<ValidationResult<User, UserAlreadyExists>>

  abstract update(entity: User): Promise<ValidationResult<User, UserNotFound>>

  abstract deleteById(Id: UUID): Promise<ValidationResult<null, UserNotFound>>

  abstract fetchProfileOwners(): Promise<ValidationResult<User[]>>
}
