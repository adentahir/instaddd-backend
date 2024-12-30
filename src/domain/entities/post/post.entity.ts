import { BaseEntity, UUID } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export interface Like {
  userId: string
  timestamp: Date
}

export interface IPost extends IEntity {
  caption: string
  media: string[] //TODO: URI[] or URL[] would be better types
  likes: Like[]
  comments: number
  profileId: UUID
}

export type CreatePostData = Omitt<
  SerializedPost,
  keyof IEntity | "likes" | "comments"
>

export interface SerializedPost extends SerializedEntity {
  caption: string
  media: string[]
  likes: Like[]
  comments: number
  profileId: string
}

export type UpdatePostData = Partial<
  Omitt<SerializedPost, keyof IEntity | "likes" | "profileId">
>

export interface IPostPublic extends Omitt<SerializedPost, "likes"> {
  likes: number
}

export class Post extends BaseEntity implements IPost {
  #caption: string
  #media: string[]
  #likes: Like[]
  #comments: number
  readonly profileId: UUID

  private constructor(data: Omitt<SerializedPost, keyof IEntity>) {
    super()

    this.#caption = data.caption
    this.#media = data.media
    this.#likes = data.likes
    this.#comments = data.comments
    this.profileId = UUID.fromTrusted(data.profileId)
  }

  static create(data: CreatePostData): Post {
    return new Post({
      ...data,
      likes: [],
      comments: 0,
    })
  }

  static fromSerialized(other: SerializedPost) {
    const ent = new Post(other)

    ent._fromSerialized(other)

    return ent
  }

  get caption(): IPost["caption"] {
    return this.#caption
  }

  get media(): IPost["media"] {
    return this.#media
  }

  get likes(): IPost["likes"] {
    return this.#likes
  }

  get comments(): IPost["comments"] {
    return this.#comments
  }

  //TODO: Guard against duplicate likes
  like(userId: string) {
    this.#likes.push({
      userId,
      timestamp: new Date(),
    })
    this.markUpdated()
    return this
  }

  //TODO: Guard against unliked likes
  unLike(userId: string) {
    this.#likes = this.#likes.filter(like => like.userId !== userId)
    this.markUpdated()
    return this
  }

  update(data: UpdatePostData) {
    const updated = {
      ...this.serialize(),
      ...data,
    } satisfies UpdatePostData

    const ent = Post.fromSerialized(updated)
    ent.markUpdated()
    return ent
  }

  toPublic(): IPostPublic {
    return {
      ...super._serialize(),
      caption: this.caption,
      media: this.media,
      likes: this.likes.length,
      comments: this.comments,
      profileId: this.profileId,
    }
  }

  serialize(): SerializedPost {
    return {
      ...super._serialize(),
      caption: this.caption,
      media: this.media,
      likes: this.likes,
      comments: this.comments,
      profileId: this.profileId,
    } satisfies SerializedPost
  }
}
