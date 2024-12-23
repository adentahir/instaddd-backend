import { UUID } from "@carbonteq/hexapp"
import { ValidationResult } from "@shared/utils"
import type { Comment } from "./comment.entity"
import type { CommentAlreadyExists, CommentNotFound } from "./comment.errors"

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class CommentRepository {
  abstract fetchById(
    id: UUID,
  ): Promise<ValidationResult<Comment, CommentNotFound>>

  abstract fetchAllForPost(
    postId: UUID,
  ): Promise<ValidationResult<Comment[], CommentNotFound>>

  abstract insert(
    entity: Comment,
  ): Promise<ValidationResult<Comment, CommentAlreadyExists>>

  abstract update(
    entity: Comment,
  ): Promise<ValidationResult<Comment, CommentNotFound>>

  abstract deleteById(
    id: UUID,
  ): Promise<ValidationResult<null, CommentNotFound>>

  //   abstract fetchAllByReplyTo(
  //     id: UUID,
  //   ): Promise<ValidationResult<Comment[], CommentNotFound>>
}
