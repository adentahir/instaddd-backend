import { BaseDto, type DtoValidationResult, UUID } from "@carbonteq/hexapp"
import z from "zod"

// DTO for Upload Profile Image
export class UploadDto extends BaseDto {
  private static readonly schema = z.object({
    buff: z.instanceof(Buffer),
  })

  private constructor(readonly buff: Buffer) {
    super()
  }

  static create(data: unknown): DtoValidationResult<UploadDto> {
    const res = BaseDto.validate(UploadDto.schema, data)
    return res.map(({ buff }) => new UploadDto(buff))
  }
}

// DTO for Update Profile
export class UpdateProfileDto extends BaseDto {
  private static readonly schema = z.object({
    id: UUID,
    username: z.string().min(1).max(128),
    fullName: z.string().min(1).max(128),
    isPrivate: z.boolean(),
    avatar: z.string().url().optional(),
  })

  private constructor(
    readonly id: UUID,
    readonly username: string,
    readonly fullName: string,
    readonly isPrivate: boolean,
    readonly avatar?: string,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<UpdateProfileDto> {
    const res = BaseDto.validate(UpdateProfileDto.schema, data)
    return res.map(
      ({ id, username, fullName, isPrivate, avatar }) =>
        new UpdateProfileDto(id, username, fullName, isPrivate, avatar),
    )
  }
}

// DTO for Find Profile
export class FindProfileDto extends BaseDto {
  private static readonly schema = z.object({
    query: z.string().min(1),
  })

  private constructor(readonly query: string) {
    super()
  }

  static create(data: unknown): DtoValidationResult<FindProfileDto> {
    const res = BaseDto.validate(FindProfileDto.schema, data)
    return res.map(({ query }) => new FindProfileDto(query))
  }
}

// DTO for Follow or Unfollow Profile
export class FollowOrUnfollowProfileDto extends BaseDto {
  private static readonly schema = z.object({
    requesterId: UUID,
    profileId: UUID,
  })

  private constructor(
    readonly requesterId: UUID,
    readonly profileId: UUID,
  ) {
    super()
  }

  static create(
    data: unknown,
  ): DtoValidationResult<FollowOrUnfollowProfileDto> {
    const res = BaseDto.validate(FollowOrUnfollowProfileDto.schema, data)
    return res.map(
      ({ requesterId, profileId }) =>
        new FollowOrUnfollowProfileDto(requesterId, profileId),
    )
  }
}
