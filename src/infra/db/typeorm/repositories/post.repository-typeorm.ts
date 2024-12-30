import { PaginationDto } from "@app/dtos/pagnation.dto"
import { UUID } from "@carbonteq/hexapp"
import { Comment } from "@domain/entities/comment/comment.entity"
import { Post } from "@domain/entities/post/post.entity"
import {
  PostAlreadyExists,
  PostNotFound,
} from "@domain/entities/post/post.errors"
import {
  PostRepository,
  PostWithComments,
} from "@domain/entities/post/post.repository"
import { ProfileOwner } from "@domain/entities/profileOwner/profileOwner.entity"
import { PostModel } from "@models/post.model"
import { ProfileOwnerModel } from "@models/profileOwner.model"
import { v4 } from "@napi-rs/uuid"
import { Provider } from "@nestjs/common"
import { Paginated, ValidationResult, toPaginated } from "@shared/utils"
import { EntityManager, Or, Repository } from "typeorm"
import ds from "../../datasource.config"

export class PostRepo extends PostRepository {
  private postRepo: Repository<PostModel>

  constructor() {
    super()
    this.postRepo = new Repository(PostModel, new EntityManager(ds))
  }

  async fetchById(id: UUID): Promise<ValidationResult<Post, PostNotFound>> {
    const data = await this.postRepo.findOne({
      where: { id: id },
      relations: ["profileOwner", "comments", "likes"],
    })

    return data
      ? {
          success: true,
          data: Post.fromSerialized({
            ...data,
            comments: data.comments.length,
            profileId: (data.profileOwner as ProfileOwner).id,
          }),
        }
      : { success: false, error: new PostNotFound(id) }
  }

  async fetchAllForProfileOwner(
    id: UUID,
  ): Promise<ValidationResult<Post[], PostNotFound>> {
    try {
      const data = await this.postRepo.find({
        where: { profileOwner: { id: id } },
        relations: ["profileOwner", "comments"],
        order: { createdAt: "DESC" },
      })
      return {
        success: true,
        data: data.map(p =>
          Post.fromSerialized({
            ...p,
            comments: p.comments.length,
            profileId: (p.profileOwner as ProfileOwner).id,
          }),
        ),
      }
    } catch (err) {
      console.debug(err)
      return { success: false, error: new PostNotFound(id) }
    }
  }

  async insert(
    entity: Post,
  ): Promise<ValidationResult<Post, PostAlreadyExists>> {
    const serializedEntity = entity.serialize()
    try {
      const { comments, ...rest } = serializedEntity
      const data = await this.postRepo.save({
        ...rest,
        profileOwner: { id: serializedEntity.profileId },
      })
      return { success: true, data: Post.fromSerialized({ ...data, comments }) }
    } catch (err) {
      return {
        success: false,
        error: new PostAlreadyExists(serializedEntity.id),
      }
    }
  }

  async update(entity: Post): Promise<ValidationResult<Post, PostNotFound>> {
    const serializedEntity = entity.serialize()
    try {
      const { comments, likes, ...rest } = serializedEntity
      if (likes.length === 0) {
        // console.log("here 0 length")
        // await this.postRepo
        //   .createQueryBuilder()
        //   .relation("likes")
        //   .of(serializedEntity.id)
        //   .delete()
        //   .execute()

        return {
          success: true,
          data: Post.fromSerialized({ ...rest, comments, likes }),
        }
      }
      const likesWithPostId = likes.map(l => ({
        ...l,
        postId: serializedEntity.id,
        id: v4(),
      }))
      console.log("likesWithPostId", likesWithPostId)
      const data = await this.postRepo.save({ ...rest, likes: likesWithPostId })
      return {
        success: true,
        data: Post.fromSerialized({ ...data, comments, likes }),
      }
    } catch (err) {
      console.debug(err)
      return {
        success: false,
        error: new PostNotFound(serializedEntity.id),
      }
    }
  }

  async deleteById(id: UUID): Promise<ValidationResult<null, PostNotFound>> {
    await this.postRepo.delete({ id })
    return { success: true, data: null }
  }

  async fetchFeedForProfileOwner(
    userId: UUID,
    dto: PaginationDto,
  ): Promise<ValidationResult<Paginated<PostWithComments>, PostNotFound>> {
    try {
      const data = await this.postRepo.find({
        where: [
          { profileOwner: { id: userId } },
          { profileOwner: { isPrivate: false } },
        ],
        relations: ["profileOwner", "comments", "likes"],
        order: { createdAt: "DESC" },
        skip: (dto.pageNum - 1) * dto.pageSize,
        take: dto.pageSize,
      })

      const total = await this.postRepo.count({
        where: [
          { profileOwner: { id: userId } },
          { profileOwner: { isPrivate: false } },
        ],
        relations: ["profileOwner", "comments", "likes"],
      })

      const posts = data.map(p =>
        Post.fromSerialized({
          ...p,
          comments: p.comments.length,
          profileId: (p.profileOwner as ProfileOwner).id,
        }),
      )

      const comments = data.flatMap(p =>
        p.comments.map(c =>
          Comment.fromSerialized({
            ...c,
            postId: p.id,
            replyto: c.replyTo ? c.replyTo.id : "",
          }),
        ),
      )

      const profileOwner = data.flatMap(p =>
        ProfileOwner.fromSerialized({
          ...(p.profileOwner as ProfileOwnerModel),
          userId: (p.profileOwner as ProfileOwnerModel).id,
        }),
      )

      const temp = {
        post: posts,
        comment: comments,
        profileOwner: profileOwner,
      }

      const paginated = toPaginated(temp, dto, total)

      return {
        success: true,
        data: paginated,
      }
    } catch (err) {
      console.debug(err)
      return { success: false, error: new PostNotFound("") }
    }
  }
}

export const PostProvider: Provider<PostRepository> = {
  provide: PostRepository,
  useClass: PostRepo,
}
