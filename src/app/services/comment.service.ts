import { AddCommentDto, UpdateCommentDto } from "@app/dtos/comment.dto"
import { UUID } from "@carbonteq/hexapp"
import { Comment } from "@domain/entities/comment/comment.entity"
import { CommentRepository } from "@domain/entities/comment/comment.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CommentService {
  constructor(private readonly commentRepo: CommentRepository) {}

  async AddComment(dto: AddCommentDto) {
    const comment = Comment.create({
      postId: dto.postId,
      message: dto.message,
      replyto: dto.replyto,
    })

    const insertedComment = await this.commentRepo.insert(comment)

    if (!insertedComment.success || !insertedComment.data) {
      return { success: false, error: insertedComment.error }
    }

    return { success: true, data: insertedComment.data.serialize() }
  }

  async RemoveComment(id: UUID) {
    const removedComment = await this.commentRepo.deleteById(id)

    if (!removedComment.success) {
      return { success: false, error: removedComment.error }
    }

    return { success: true, data: "Comment removed" }
  }

  async UpdateComment(dto: UpdateCommentDto) {
    const comment = await this.commentRepo.fetchById(dto.id)

    if (!comment.success || !comment.data) {
      return { success: false, error: comment.error }
    }

    const updatedComment = comment.data.update({ message: dto.message })

    const updated = await this.commentRepo.update(updatedComment)

    if (!updated.success || !updated.data) {
      return { success: false, error: updated.error }
    }

    return { success: true, data: updated.data.serialize() }
  }

  async getAllComments(id: UUID) {
    const comments = await this.commentRepo.fetchAllForPost(id)

    if (!comments.success || !comments.data) {
      return { success: false, error: comments.error }
    }

    return { success: true, data: comments.data.map(c => c.serialize()) }
  }
}
