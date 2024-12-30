import {
  FindProfileDto,
  FollowOrUnfollowProfileDto,
  UpdateProfileDto,
  UploadDto,
} from "@app/dtos/user.dto"
import { UUID } from "@carbonteq/hexapp"
import { FollowRequestRepository } from "@domain/entities/followRequest/followRequest.repository"
import { ProfileOwnerRepository } from "@domain/entities/profileOwner/profileOwner.repository"
import { Injectable } from "@nestjs/common"
import { PostService } from "./post.service"
import { StorageService } from "./storage.service"

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileOwnerRepo: ProfileOwnerRepository,
    // private readonly followRequestRepo: FollowRequestRepository,
    private readonly storageServ: StorageService,
    private readonly postServ: PostService,
  ) {}

  async uploadProfileImage(buff: Buffer) {
    const media = await this.storageServ.add(buff)
    return { success: true, data: media }
  }

  async deleteProfile(id: UUID) {
    const removedProfile = await this.profileOwnerRepo.deleteById(id)

    if (!removedProfile.success) {
      return { success: false, error: removedProfile.error }
    }

    return { success: true, data: "Profile removed" }
  }

  async updateProfile(dto: UpdateProfileDto) {
    const profile = await this.profileOwnerRepo.fetchById(dto.id)

    if (!profile.success || !profile.data) {
      return { success: false, error: profile.error }
    }

    const updatedProfile = profile.data.update({
      username: dto.username,
      fullName: dto.fullName,
      isPrivate: dto.isPrivate,
      avatar: dto.avatar,
    })

    const updated = await this.profileOwnerRepo.update(updatedProfile)

    if (!updated.success || !updated.data) {
      return { success: false, error: updated.error }
    }

    return { success: true, data: updated.data.serialize() }
  }

  async findProfile(dto: FindProfileDto) {
    const profiles = await this.profileOwnerRepo.search(dto.query)

    if (!profiles.success || !profiles.data) {
      return { success: false, error: profiles.error }
    }

    return { success: true, data: profiles.data.map(p => p.serialize()) }
  }

  async followOrUnfollowProfile(dto: FollowOrUnfollowProfileDto) {
    const profile = await this.profileOwnerRepo.fetchById(dto.profileId)

    if (!profile.success || !profile.data) {
      return { success: false, error: profile.error }
    }

    // check if account is private and send follow request
    if (profile.data.isPrivate) {
      // const followRequest = FollowRequest.create({
      //   requesterId: dto.requesterId,
      //   targetId: dto.profileId,
      // })
      // const insertedFollowRequest =
      //   await this.followRequestRepo.insert(followRequest)
      // if (!insertedFollowRequest.success || !insertedFollowRequest.data) {
      //   return { success: false, error: insertedFollowRequest.error }
      // }
    }

    const following = await this.profileOwnerRepo.getFollowers(dto.profileId)

    if (!following.success || !following.data) {
      return { success: false, error: following.error }
    }

    if (following.data.map(p => p.id).includes(dto.requesterId)) {
      await this.profileOwnerRepo.unfollow(dto.profileId, dto.requesterId)
      return { success: true, data: "Unfollowed" }
    }

    await this.profileOwnerRepo.follow(dto.profileId, dto.requesterId)
    return { success: true, data: "Followed" }
  }

  async fetchUser(id: UUID) {
    return await this.profileOwnerRepo.fetchById(id)
  }
}
