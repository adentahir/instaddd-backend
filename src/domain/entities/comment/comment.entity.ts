import { BaseEntity, UUID } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export interface IComment extends IEntity {
  postId: UUID
  message: string
  replyto: UUID | null
}

export interface SerializedComment extends SerializedEntity {
  postId: string
  message: string
  replyto: string | null
}

export type UpdateCommentData = Pick<SerializedComment, "message">

export class Comment extends BaseEntity implements IComment {
  readonly postId: UUID
  readonly replyto: UUID | null
  #message: string

  private constructor(data: Omitt<SerializedComment, keyof IEntity>) {
    super()

    this.postId = UUID.fromTrusted(data.postId)
    this.replyto = data.replyto ? UUID.fromTrusted(data.replyto) : null //TODO: could be avoided by using Option type
    this.#message = data.message
  }

  static create(data: Omitt<SerializedComment, keyof IEntity>): Comment {
    return new Comment(data)
  }

  static fromSerialized(other: SerializedComment) {
    const ent = new Comment(other)

    ent._fromSerialized(other)

    return ent
  }

  get message(): IComment["message"] {
    return this.#message
  }

  update(data: UpdateCommentData) {
    const updated = {
      ...this.serialize(),
      ...data,
    } satisfies UpdateCommentData

    const ent = Comment.fromSerialized(updated)
    ent.markUpdated()
    return ent
  }

  serialize(): SerializedComment {
    return {
      ...super._serialize(),
      postId: this.postId,
      replyto: this.replyto,
      message: this.#message,
    } satisfies SerializedComment
  }
}
