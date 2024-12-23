import { UUID } from "@carbonteq/hexapp"
import { ValidationResult } from "@shared/utils"
import type { FollowRequest } from "./followRequest.entity"
import type {
  FollowRequestAlreadyExists,
  FollowRequestNotFound,
} from "./followRequest.errors"

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class FollowRequestRepository {
  abstract fetchById(
    id: UUID,
  ): Promise<ValidationResult<FollowRequest, FollowRequestNotFound>>

  abstract insert(
    entity: FollowRequest,
  ): Promise<ValidationResult<FollowRequest, FollowRequestAlreadyExists>>

  abstract deleteById(
    id: UUID,
  ): Promise<ValidationResult<null, FollowRequestNotFound>>
}
