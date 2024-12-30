import { PaginationDto } from "@app/dtos/pagnation.dto"
import {
  AddPostDto,
  LikeOrUndoLikePostDto,
  UpdatePostDto,
  UploadDto,
} from "@app/dtos/post.dto"
import { UUID } from "@carbonteq/hexapp"
import { Post } from "@domain/entities/post/post.entity"
import { PostRepository } from "@domain/entities/post/post.repository"
import { Injectable } from "@nestjs/common"
import { StorageService } from "./storage.service"

@Injectable()
export class PostService {
  constructor(
    private readonly storageServ: StorageService,
    private readonly postRepo: PostRepository,
  ) {}

  async UploadMedia({ buff }: UploadDto) {
    const media = await this.storageServ.add(buff)
    return { success: true, data: media }
  }

  async AddPost(dto: AddPostDto) {
    const post = Post.create({
      caption: dto.caption,
      media: dto.media,
      profileId: dto.profileId,
    })

    const insertedPost = await this.postRepo.insert(post)

    if (!insertedPost.success || !insertedPost.data) {
      return { success: false, error: insertedPost.error }
    }

    return { success: true, data: insertedPost.data.serialize() }
  }

  async RemovePost(id: UUID) {
    const removedPost = await this.postRepo.deleteById(id)

    if (!removedPost.success) {
      return { success: false, error: removedPost.error }
    }

    return { success: true, data: "Post removed" }
  }

  async UpdatePost(dto: UpdatePostDto) {
    const post = await this.postRepo.fetchById(dto.id)

    if (!post.success || !post.data) {
      return { success: false, error: post.error }
    }

    const updatedPost = post.data.update({ caption: dto.caption })

    const updated = await this.postRepo.update(updatedPost)

    if (!updated.success || !updated.data) {
      return { success: false, error: updated.error }
    }

    return { success: true, data: updated.data.serialize() }
  }

  async LikeOrUndoLikePost({ postId, userId }: LikeOrUndoLikePostDto) {
    const post = await this.postRepo.fetchById(postId)
    console.log(post.data?.serialize())

    if (!post.success || !post.data) {
      return { success: false, error: post.error }
    }

    let update: Post | null = null

    if (post.data.like.length === 0) {
      update = post.data.like(userId)
    } else if (post.data.like.length > 0) {
      update = post.data.likes.find(like => like.userId === userId)
        ? post.data.unLike(userId)
        : post.data.like(userId)
    }

    if (!update) {
      return { success: false, error: "Failed to update post" }
    }

    const updated = await this.postRepo.update(update)

    if (!updated.success || !updated.data) {
      return { success: false, error: updated.error }
    }

    return { success: true, data: updated.data.serialize() }
  }

  async FetchPostForProfile(id: UUID) {
    const posts = await this.postRepo.fetchAllForProfileOwner(id)

    if (!posts.success || !posts.data) {
      return { success: false, error: posts.error }
    }

    return { success: true, data: posts.data.map(p => p.serialize()) }
  }

  async FetchFeedForProfileOwner(userId: UUID, dto: PaginationDto) {
    const posts = await this.postRepo.fetchFeedForProfileOwner(userId, dto)

    if (!posts.success || !posts.data) {
      return { success: false, error: posts.error }
    }

    const comments = posts.data.data.comment.map(c => c.serialize())
    const postsSer = posts.data.data.post.map(p => p.serialize())
    const profiles = posts.data.data.profileOwner.map(p => p.serialize())

    const serData = { comments, posts: postsSer, profiles }

    return {
      success: true,
      data: {
        data: serData,
        pageNum: posts.data.pageNum,
        pageSize: posts.data.pageSize,
        totalPages: posts.data.totalPages,
      },
    }
  }
}
