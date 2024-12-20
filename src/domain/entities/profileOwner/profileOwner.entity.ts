import { BaseEntity } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export interface IProfileOwner extends IEntity {
  username: string
  fullName: string
  avatar: string | null // We can use Option to avoid defending null values
  isPrivate: boolean
}

export interface SerializedProfileOwner
  extends SerializedEntity,
    Omitt<IProfileOwner, keyof IEntity> {}

export class ProfileOwner extends BaseEntity implements IProfileOwner {
  #username: string
  #fullName: string
  #avatar: string | null
  #isPrivate: boolean

  private constructor(data: Omitt<SerializedProfileOwner, keyof IEntity>) {
    super()
    this.#username = data.username
    this.#fullName = data.fullName
    this.#avatar = data.avatar
    this.#isPrivate = data.isPrivate
  }

  static newAdmin(
    data: Omitt<SerializedProfileOwner, keyof IEntity>,
  ): ProfileOwner {
    return new ProfileOwner(data)
  }

  static newProfileOwner(
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

  serialize(): SerializedProfileOwner {
    return {
      ...super._serialize(),
      username: this.username,
      fullName: this.fullName,
      avatar: this.avatar,
      isPrivate: this.isPrivate,
    } satisfies SerializedProfileOwner
  }
}
