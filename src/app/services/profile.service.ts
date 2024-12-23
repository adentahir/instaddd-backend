import {
  FindProfileDto,
  FollowOrUnfollowProfileDto,
  UpdateProfileDto,
  UploadDto,
} from "@app/dtos/user.dto"
import { UUID } from "@carbonteq/hexapp"
import { CommentRepository } from "@domain/entities/comment/comment.repository"
import { FollowRequest } from "@domain/entities/followRequest/followRequest.entity"
import { FollowRequestRepository } from "@domain/entities/followRequest/followRequest.repository"
import { ProfileOwnerRepository } from "@domain/entities/profileOwner/profileOwner.repository"
import { UserRepository } from "@domain/entities/user/user.respository"
import { Injectable } from "@nestjs/common"
import { StorageService } from "./storage.service"

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileOwnerRepo: ProfileOwnerRepository,
    private readonly followRequestRepo: FollowRequestRepository,
    private readonly storageServ: StorageService,
  ) {}

  async uploadProfileImage({ buff }: UploadDto) {
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

    // check if account is private
    if (profile.data.isPrivate) {
      const followRequest = FollowRequest.create({
        requesterId: dto.requesterId,
        targetId: dto.profileId,
      })

      const insertedFollowRequest =
        await this.followRequestRepo.insert(followRequest)

      if (!insertedFollowRequest.success || !insertedFollowRequest.data) {
        return { success: false, error: insertedFollowRequest.error }
      }
    }
  }
}
