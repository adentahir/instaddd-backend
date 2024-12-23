import { BaseEntity, UUID } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export interface IProfileOwner extends IEntity {
  username: string
  fullName: string
  avatar: string | null // We can use Option to avoid defending null values
  isPrivate: boolean
  userId: UUID
}

export interface SerializedProfileOwner
  extends SerializedEntity,
    Omitt<IProfileOwner, keyof IEntity | "userId"> {
  userId: string
}

export class ProfileOwner extends BaseEntity implements IProfileOwner {
  #username: string
  #fullName: string
  #avatar: string | null
  #isPrivate: boolean
  readonly userId: UUID

  private constructor(data: Omitt<SerializedProfileOwner, keyof IEntity>) {
    super()
    this.#username = data.username
    this.#fullName = data.fullName
    this.#avatar = data.avatar
    this.#isPrivate = data.isPrivate
    this.userId = UUID.fromTrusted(data.userId)
  }

  static create(
    data: Omitt<SerializedProfileOwner, keyof IEntity>,
  ): ProfileOwner {
    return new ProfileOwner(data)
  }

  static fromSerialized(other: SerializedProfileOwner) {
    const ent = new ProfileOwner(other)

    ent._fromSerialized(other)

    return ent
  }

  get username(): IProfileOwner["username"] {
    return this.#username
  }

  get fullName(): IProfileOwner["fullName"] {
    return this.#fullName
  }

  get avatar(): IProfileOwner["avatar"] {
    return this.#avatar
  }

  get isPrivate(): IProfileOwner["isPrivate"] {
    return this.#isPrivate
  }

  update(data: Partial<Omitt<SerializedProfileOwner, keyof IEntity>>) {
    // Omit unnecessary fields for security reasons
    //TODO: Guarding before updating the entity
    const updated = {
      ...this.serialize(),
      ...data,
    }

    const ent = ProfileOwner.fromSerialized(updated)
    ent.markUpdated()

    return ent
  }

  serialize(): SerializedProfileOwner {
    return {
      ...super._serialize(),
      username: this.username,
      fullName: this.fullName,
      avatar: this.avatar,
      isPrivate: this.isPrivate,
      userId: this.userId,
    } satisfies SerializedProfileOwner
  }
}
