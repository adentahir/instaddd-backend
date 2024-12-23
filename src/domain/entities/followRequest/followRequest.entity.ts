import { BaseEntity, UUID } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export interface IFollowRequest extends IEntity {
  requesterId: UUID
  targetId: UUID
}

export interface SerializedFollowRequest extends SerializedEntity {
  requesterId: string
  targetId: string
}

export class FollowRequest extends BaseEntity implements IFollowRequest {
  readonly requesterId: UUID
  readonly targetId: UUID

  private constructor(data: Omitt<SerializedFollowRequest, keyof IEntity>) {
    super()

    this.requesterId = UUID.fromTrusted(data.requesterId)
    this.targetId = UUID.fromTrusted(data.targetId)
  }

  static create(
    data: Omitt<SerializedFollowRequest, keyof IEntity>,
  ): FollowRequest {
    return new FollowRequest(data)
  }

  static fromSerialized(other: SerializedFollowRequest) {
    const ent = new FollowRequest(other)

    ent._fromSerialized(other)

    return ent
  }

  serialize(): SerializedFollowRequest {
    return {
      ...super._serialize(),
      requesterId: this.requesterId,
      targetId: this.targetId,
    } satisfies SerializedFollowRequest
  }
}
