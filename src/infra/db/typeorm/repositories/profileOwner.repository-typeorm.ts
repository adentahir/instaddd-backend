import { UUID } from "@carbonteq/hexapp"
import { ProfileOwner } from "@domain/entities/profileOwner/profileOwner.entity"
import {
  ProfileOwnerAlreadyExists,
  ProfileOwnerNotFound,
} from "@domain/entities/profileOwner/profileOwner.errors"
import { ProfileOwnerRepository } from "@domain/entities/profileOwner/profileOwner.repository"
import { Provider } from "@nestjs/common"
import { ValidationResult } from "@shared/utils"
import { EntityManager, ILike, Like, Repository } from "typeorm"
import ds from "../../datasource.config"
import { ProfileOwnerModel } from "../models/profileOwner.model"

export class ProfileOwnerRepo extends ProfileOwnerRepository {
  private profileOwnerRepo: Repository<ProfileOwnerModel>

  constructor() {
    super()
    this.profileOwnerRepo = new Repository(
      ProfileOwnerModel,
      new EntityManager(ds),
    )
  }

  async fetchById(
    id: UUID,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerNotFound>> {
    const data = await this.profileOwnerRepo.findOne({
      where: { id },
      relations: ["user"],
    })
    if (data === null)
      return { success: false, error: new ProfileOwnerNotFound(id) }

    return data
      ? {
          success: true,
          data: ProfileOwner.fromSerialized({
            ...data,
            userId: data.user.id,
          }),
        }
      : { success: false, error: new ProfileOwnerNotFound(id) }
  }

  async insert(
    entity: ProfileOwner,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerAlreadyExists>> {
    try {
      const serializedEntity = entity.serialize()
      const po = this.profileOwnerRepo.create(serializedEntity)
      await this.profileOwnerRepo.save(po, { reload: true })

      return { success: true, data: entity }
    } catch (err) {
      console.log(err)
      return {
        success: false,
        error: new ProfileOwnerAlreadyExists(entity.username),
      }
    }
  }

  async search(
    searchTerm: string,
  ): Promise<ValidationResult<ProfileOwner[], ProfileOwnerNotFound>> {
    const data = await this.profileOwnerRepo.find({
      where: [
        { username: ILike(`%${searchTerm}%`) },
        { fullName: ILike(`%${searchTerm}%`) },
      ],
      relations: ["user"],
    })

    if (data.length === 0) {
      return { success: false, error: new ProfileOwnerNotFound(searchTerm) }
    }

    const ents = data.map(po =>
      ProfileOwner.fromSerialized({
        ...po,
        userId: po.id,
      }),
    )

    return { success: true, data: ents }
  }

  async update(
    entity: ProfileOwner,
  ): Promise<ValidationResult<ProfileOwner, ProfileOwnerNotFound>> {
    try {
      const serializedEntity = entity.serialize()
      const data = await this.profileOwnerRepo.save(serializedEntity)
      return { success: true, data: ProfileOwner.fromSerialized(data) }
    } catch (err) {
      console.debug(err)
      return { success: false, error: new ProfileOwnerNotFound(entity.id) }
    }
  }

  async deleteById(
    id: UUID,
  ): Promise<ValidationResult<null, ProfileOwnerNotFound>> {
    const existingEntity = await this.profileOwnerRepo.findOne({
      where: { id },
    })

    if (!existingEntity) {
      return { success: false, error: new ProfileOwnerNotFound(id) }
    }

    await this.profileOwnerRepo.delete({ id })
    return { success: true, data: null }
  }

  async follow(followerId: UUID, followingId: UUID): Promise<void> {
    const follower = await this.profileOwnerRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    })

    const following = await this.profileOwnerRepo.findOne({
      where: { id: followingId },
    })

    if (!follower || !following) {
      throw new Error("Follower or following profile not found.")
    }

    if (follower.following.find(profile => profile.id === followingId)) {
      throw new Error("You are already following this profile.")
    }

    follower.following.push(following)
    await this.profileOwnerRepo.save(follower)
  }

  async unfollow(followerId: UUID, followingId: UUID): Promise<void> {
    const follower = await this.profileOwnerRepo.findOne({
      where: { id: followerId },
      relations: ["following"],
    })

    if (!follower) {
      throw new Error("Follower profile not found.")
    }

    follower.following = follower.following.filter(
      profile => profile.id !== followingId,
    )

    await this.profileOwnerRepo.save(follower)
  }

  async getFollowers(
    profileId: UUID,
  ): Promise<ValidationResult<ProfileOwner[], ProfileOwnerNotFound>> {
    const profile = await this.profileOwnerRepo.findOne({
      where: { id: profileId },
      relations: ["followers"],
    })

    if (!profile) {
      return { success: false, error: new ProfileOwnerNotFound(profileId) }
    }

    const serializedFollowers = profile.followers.map(follower =>
      ProfileOwner.fromSerialized({
        ...follower,
        userId: follower.user.id,
      }),
    )
    return { success: true, data: serializedFollowers }
  }

  async getFollowing(
    profileId: UUID,
  ): Promise<ValidationResult<ProfileOwner[], ProfileOwnerNotFound>> {
    const profile = await this.profileOwnerRepo.findOne({
      where: { id: profileId },
      relations: ["following"],
    })

    if (!profile) {
      return { success: false, error: new ProfileOwnerNotFound(profileId) }
    }

    const serializedFollowing = profile.following.map(following =>
      ProfileOwner.fromSerialized({
        ...following,
        userId: following.user.id,
      }),
    )
    return { success: true, data: serializedFollowing }
  }
}

export const ProfileOwnerRepoProvider: Provider<ProfileOwnerRepository> = {
  provide: ProfileOwnerRepository,
  useClass: ProfileOwnerRepo,
}
