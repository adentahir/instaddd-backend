import { UUID } from "@carbonteq/hexapp"
import { Comment } from "@domain/entities/comment/comment.entity"
import {
  CommentAlreadyExists,
  CommentNotFound,
} from "@domain/entities/comment/comment.errors"
import { CommentRepository } from "@domain/entities/comment/comment.repository"
import { ValidationResult } from "@shared/utils"
import { EntityManager, Repository } from "typeorm"
import ds from "../../datasource.config"
import { CommentModel } from "../models/comment.model"

export class CommentRepo extends CommentRepository {
  private commentRepo: Repository<CommentModel>

  constructor() {
    super()
    this.commentRepo = new Repository(CommentModel, new EntityManager(ds))
  }

  async fetchById(
    id: UUID,
  ): Promise<ValidationResult<Comment, CommentNotFound>> {
    const data = await this.commentRepo.findOne({ where: { id } })
    return data
      ? {
          success: true,
          data: Comment.fromSerialized({ ...data, replyto: "" }),
        }
      : { success: false, error: new CommentNotFound(id) }
  }

  async fetchAllForPost(
    postId: UUID,
  ): Promise<ValidationResult<Comment[], CommentNotFound>> {
    const data = await this.commentRepo.find({ where: { postId } })
    return {
      success: true,
      data: data.map(c => Comment.fromSerialized({ ...c, replyto: "" })),
    }
  }

  async insert(
    entity: Comment,
  ): Promise<ValidationResult<Comment, CommentAlreadyExists>> {
    const serializedEntity = entity.serialize()
    const data = await this.commentRepo.save(serializedEntity)
    return { success: true, data: Comment.fromSerialized(data) }
  }

  async update(
    entity: Comment,
  ): Promise<ValidationResult<Comment, CommentNotFound>> {
    const serializedEntity = entity.serialize()
    const data = await this.commentRepo.save(serializedEntity)
    return { success: true, data: Comment.fromSerialized(data) }
  }

  async deleteById(id: UUID): Promise<ValidationResult<null, CommentNotFound>> {
    await this.commentRepo.delete({ id })
    return { success: true, data: null }
  }
}
