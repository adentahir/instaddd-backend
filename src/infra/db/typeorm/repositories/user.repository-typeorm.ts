import { UserRepository } from "@domain/entities/user/user.respository"
import { EntityManager, Repository } from "typeorm"
import { UserModel } from "../models/user.model"

import type { Email, UUID } from "@carbonteq/hexapp"
import { User, UserRole } from "@domain/entities/user/user.entity"
import {
  UserAlreadyExists,
  UserNotFound,
} from "@domain/entities/user/user.errors"
import type { Provider } from "@nestjs/common"
import { ValidationResult } from "@shared/utils"
import ds from "../../datasource.config"

export class UserRepo extends UserRepository {
  private userRepo: Repository<UserModel>
  constructor() {
    super()
    this.userRepo = new Repository(UserModel, new EntityManager(ds))
  }

  async fetchUser(): Promise<ValidationResult<User[], UserNotFound>> {
    const data = await this.userRepo.find({ where: { role: UserRole.Admin } })

    const ents = data.map(User.fromSerialized)

    return { success: true, data: ents }
  }

  async fetchProfileOwners(): Promise<ValidationResult<User[]>> {
    const data = await this.userRepo.find({
      where: { role: UserRole.ProfileOwner },
    })

    const ents = data.map(User.fromSerialized)

    return { success: true, data: ents }
  }

  async fetchByEmail(
    email: Email,
  ): Promise<ValidationResult<User, UserNotFound>> {
    const emailSer = email

    const data = await this.userRepo.findOne({ where: { email: emailSer } })

    if (data === null) return { success: false, error: new UserNotFound(email) } //TODO: create and return custom error

    const ent = User.fromSerialized(data)

    return { success: true, data: ent }
  }

  async fetchById(id: UUID): Promise<ValidationResult<User, UserNotFound>> {
    const data = await this.userRepo.findOne({ where: { id: id } })

    if (data === null) return { success: false, error: new UserNotFound(id) }

    const ent = User.fromSerialized(data)

    return { success: true, data: ent }
  }

  async insert(
    entity: User,
  ): Promise<ValidationResult<User, UserAlreadyExists>> {
    const data = entity.serialize()

    try {
      const newUserData = this.userRepo.create(entity.serialize())

      await this.userRepo.save(newUserData, { reload: true })

      return { success: true, data: User.fromSerialized(data) }
    } catch (err) {
      return { success: false, error: new UserAlreadyExists(entity.email) }
    }
  }

  async update(entity: User): Promise<ValidationResult<User, UserNotFound>> {
    const data = entity.serialize()

    try {
      const userData = {
        id: data.id,
        email: data.email,
        password: data.password,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }

      await this.userRepo.update({ id: entity.id }, userData)

      return { success: true, data: User.fromSerialized(data) }
    } catch (err) {
      return { success: false, error: new UserNotFound(entity.email) }
    }
  }

  async deleteById(Id: UUID): Promise<ValidationResult<null, UserNotFound>> {
    try {
      const data = await this.userRepo.findOne({
        where: { id: Id },
      })

      if (data === null) return { success: false, error: new UserNotFound(Id) }

      await this.userRepo.delete({ id: Id })

      return { success: true, data: null }
    } catch (err) {
      return { success: false, error: new UserNotFound(Id) }
    }
  }

  async fetchUserByEmail(
    email: string,
  ): Promise<ValidationResult<User, UserNotFound>> {
    try {
      const fetchedUser = await this.userRepo.findOne({
        where: { email: email },
      })

      if (fetchedUser === null)
        return { success: false, error: new UserNotFound(email) }

      const ent = User.fromSerialized(fetchedUser)

      return { success: true, data: ent }
    } catch (err) {
      console.debug(err)
      return { success: false, error: new UserNotFound(email) }
    }
  }
}

export const UserRepoProvider: Provider<UserRepository> = {
  provide: UserRepository,
  useClass: UserRepo,
}
