import { BaseDto, type DtoValidationResult, Email } from "@carbonteq/hexapp"
import z from "zod"

export class LoginDto extends BaseDto {
  private static readonly schema = z.object({
    email: Email,
    password: z.string(),
  })

  private constructor(
    readonly email: Email,
    readonly password: string,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<LoginDto> {
    const res = BaseDto.validate(LoginDto.schema, data)

    return res.map(({ email, password }) => new LoginDto(email, password))
  }
}

export class SignUpDto extends BaseDto {
  private static readonly schema = z.object({
    email: Email,
    password: z.string().min(8).max(128),
    username: z.string().min(3).max(30),
    fullName: z.string().min(1).max(100),
    isPrivate: z.boolean().optional().default(false),
    avatar: z.string().url().nullable(),
  })

  private constructor(
    readonly email: Email,
    readonly password: string,
    readonly username: string,
    readonly fullName: string,
    readonly avatar: string | null,
    readonly isPrivate: boolean = false,
  ) {
    super()
  }

  static create(data: unknown): DtoValidationResult<SignUpDto> {
    const res = BaseDto.validate(SignUpDto.schema, data)
    return res.map(
      ({ email, password, username, fullName, isPrivate, avatar }) =>
        new SignUpDto(email, password, username, fullName, avatar, isPrivate),
    )
  }
}
