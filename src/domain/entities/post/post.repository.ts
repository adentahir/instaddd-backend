import { UUID } from "@carbonteq/hexapp"
import { ValidationResult } from "@shared/utils"
import type { Post } from "./post.entity"
import type { PostAlreadyExists, PostNotFound } from "./post.errors"

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class PostRepository {
  abstract fetchById(id: UUID): Promise<ValidationResult<Post, PostNotFound>>

  abstract fetchAllForProfileOwner(
    postId: UUID,
  ): Promise<ValidationResult<Post[], PostNotFound>>

  abstract insert(
    entity: Post,
  ): Promise<ValidationResult<Post, PostAlreadyExists>>

  abstract update(entity: Post): Promise<ValidationResult<Post, PostNotFound>>

  abstract deleteById(Id: UUID): Promise<ValidationResult<null, PostNotFound>>

  //   abstract fetchAllforTags(
  //     tags: string[],
  //   ): Promise<ValidationResult<Post[], PostNotFound>>
}
