import { BaseDto, type DtoValidationResult, UUID } from "@carbonteq/hexapp"
import z from "zod"

// DTO for Upload Media
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

// DTO for Add Post
export class AddPostDto extends BaseDto {
  private static readonly schema = z.object({
    caption: z.string().min(1).max(500),
    media: z.array(z.string().url()),
    profileId: UUID,
  })

  private constructor(
    readonly caption: string,
    readonly media: string[],
    readonly profileId: UUID,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<AddPostDto> {
    const res = BaseDto.validate(AddPostDto.schema, data)
    return res.map(
      ({ caption, media, profileId }) =>
        new AddPostDto(caption, media, profileId),
    )
  }
}

// DTO for Update Post
export class UpdatePostDto extends BaseDto {
  private static readonly schema = z.object({
    id: UUID,
    caption: z.string().min(1).max(500),
  })

  private constructor(
    readonly id: UUID,
    readonly caption: string,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<UpdatePostDto> {
    const res = BaseDto.validate(UpdatePostDto.schema, data)
    return res.map(({ id, caption }) => new UpdatePostDto(id, caption))
  }
}

// DTO for Like or Undo Like Post
export class LikeOrUndoLikePostDto extends BaseDto {
  private static readonly schema = z.object({
    userId: UUID,
  })

  private constructor(
    readonly postId: UUID,
    readonly userId: UUID,
  ) {
    super()
  }

  static create(
    data: unknown,
    postId: UUID,
  ): DtoValidationResult<LikeOrUndoLikePostDto> {
    const res = BaseDto.validate(LikeOrUndoLikePostDto.schema, data)
    return res.map(({ userId }) => new LikeOrUndoLikePostDto(postId, userId))
  }
}
