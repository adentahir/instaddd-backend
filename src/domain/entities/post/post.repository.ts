import { PaginationDto } from "@app/dtos/pagnation.dto"
import { Omitt, UUID } from "@carbonteq/hexapp"
import { Comment } from "@domain/entities/comment/comment.entity"
import { Paginated, ValidationResult } from "@shared/utils"
import { ProfileOwner } from "../profileOwner/profileOwner.entity"
import { Post } from "./post.entity"
import type { PostAlreadyExists, PostNotFound } from "./post.errors"

export type PostWithComments = {
  post: Post[]
  comment: Comment[]
  profileOwner: ProfileOwner[]
}

//TODO: Create a Base Repository Class with genrics and extend All Repositories for Open Closed Principle
export abstract class PostRepository {
  abstract fetchById(id: UUID): Promise<ValidationResult<Post, PostNotFound>>

  abstract fetchAllForProfileOwner(
    userId: UUID,
  ): Promise<ValidationResult<Post[], PostNotFound>>

  abstract insert(
    entity: Post,
  ): Promise<ValidationResult<Post, PostAlreadyExists>>

  abstract update(entity: Post): Promise<ValidationResult<Post, PostNotFound>>

  abstract deleteById(Id: UUID): Promise<ValidationResult<null, PostNotFound>>

  abstract fetchFeedForProfileOwner(
    userId: UUID,
    dto: PaginationDto,
  ): Promise<ValidationResult<Paginated<PostWithComments>, PostNotFound>> //todo: Make a readmodel
}
