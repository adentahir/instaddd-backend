import { BaseDto, type DtoValidationResult, UUID } from "@carbonteq/hexapp"
import z from "zod"

// DTO for Adding a Comment
export class AddCommentDto extends BaseDto {
  private static readonly schema = z.object({
    postId: UUID,
    message: z.string().min(1).max(500),
    replyto: z.string().uuid().nullable(), // Reply to another comment (optional)
  })

  private constructor(
    readonly postId: UUID,
    readonly message: string,
    readonly replyto: string | null,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<AddCommentDto> {
    const res = BaseDto.validate(AddCommentDto.schema, data)
    return res.map(
      ({ postId, message, replyto }) =>
        new AddCommentDto(postId, message, replyto),
    )
  }
}

// DTO for Updating a Comment
export class UpdateCommentDto extends BaseDto {
  private static readonly schema = z.object({
    id: UUID,
    message: z.string().min(1).max(500),
  })

  private constructor(
    readonly id: UUID,
    readonly message: string,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<UpdateCommentDto> {
    const res = BaseDto.validate(UpdateCommentDto.schema, data)
    return res.map(({ id, message }) => new UpdateCommentDto(id, message))
  }
}
