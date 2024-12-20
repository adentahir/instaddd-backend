import { Email, UUID } from "@carbonteq/hexapp"
import { ValidationResult } from "@shared/utils"
import type { ProfileOwner } from "./profileOwner.entity"
import type {
  ProfileOwnerAlreadyExists,
  ProfileOwnerNotFound,
} from "./profileOwner.errors"

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class ProfileOwnerRepository {
  abstract fetchById(
    id: UUID,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerNotFound>>

  abstract insert(
    entity: ProfileOwner,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerAlreadyExists>>

  abstract update(
    entity: ProfileOwner,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerNotFound>>

  abstract deleteById(
    Id: UUID,
  ): Promise<ValidationResult<null, ProfileOwnerNotFound>>
}
