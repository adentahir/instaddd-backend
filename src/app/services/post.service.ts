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

    if (!post.success || !post.data) {
      return { success: false, error: post.error }
    }

    const updateEnt = post.data.likes.find(like => like.userId === userId)
      ? post.data.unLike(userId)
      : post.data.like(userId)

    const updated = await this.postRepo.update(updateEnt)

    if (!updated.success || !updated.data) {
      return { success: false, error: updated.error }
    }

    return { success: true, data: updated.data.serialize() }
  }
}
