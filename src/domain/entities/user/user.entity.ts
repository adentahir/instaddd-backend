import { BaseEntity, Email } from "@carbonteq/hexapp"
import type { IEntity, Omitt, SerializedEntity } from "@shared/utils"

export enum UserRole {
  Admin = "admin",
  ProfileOwner = "profileOwner",
}

export interface IUser extends IEntity {
  email: string
  password: string
  role: UserRole
}

export interface SerializedUser extends SerializedEntity {
  email: string
  password: string
  role: UserRole
}

export type IUserPublic = Omitt<SerializedUser, "password">

export class User extends BaseEntity implements IUser {
  #email: Email
  #password: string

  private constructor(
    email: Email,
    password: string,
    readonly role: UserRole,
  ) {
    super()

    this.#email = email
    this.#password = password
  }

  static newAdmin(email: Email, password: string): User {
    return new User(email, password, UserRole.Admin)
  }

  static newProfileOwner(email: Email, password: string): User {
    return new User(email, password, UserRole.ProfileOwner)
  }

  updatePassword(password: string) {
    this.#password = password
    this.markUpdated()
    return this
  }

  toPublic(): IUserPublic {
    return {
      role: this.role,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      email: this.email,
    }
  }

  static fromSerialized(other: SerializedUser) {
    const email = Email.create(other.email).unwrap()

    const ent = new User(email, other.password, other.role)

    ent._fromSerialized(other)

    return ent
  }

  get email(): IUser["email"] {
    return this.#email
  }

  get password(): IUser["password"] {
    return this.#password
  }

  serialize(): SerializedUser {
    return {
      ...super._serialize(),
      email: this.email,
      password: this.password,
      role: this.role,
    } satisfies SerializedUser
  }
}
