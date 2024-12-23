import type { LoginDto, SignUpDto } from "@app/dtos/auth.dto"
import { JwtService } from "@app/services"
import { PwHashingService } from "@app/services/pw-hashing.service"
import { ProfileOwner } from "@domain/entities/profileOwner/profileOwner.entity"
import { ProfileOwnerRepository } from "@domain/entities/profileOwner/profileOwner.repository"
import { User } from "@domain/entities/user/user.entity"
import { UserRepository } from "@domain/entities/user/user.respository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AuthService {
  constructor(
    private readonly pwHashServ: PwHashingService,
    private readonly tokenServ: JwtService,
    private readonly userRepo: UserRepository,
    private readonly profileOwnerRepo: ProfileOwnerRepository,
  ) {}

  async login({ email, password }: LoginDto) {
    const userRes = await this.userRepo.fetchByEmail(email)

    // TODO: Can be simplified with a helper function
    if (userRes.success === false || userRes.data === undefined)
      return { success: false, error: userRes.error }

    const match = this.pwHashServ.compare(password, userRes.data.password)

    if (match.success === false) return { success: false, error: match.error }

    const view = await this.tokenServ.sign({
      email: userRes.data.email,
      role: userRes.data.role,
    })

    return { success: true, data: view }
  }

  async signup({
    email,
    password,
    username,
    fullName,
    isPrivate,
    avatar,
  }: SignUpDto) {
    const pwHashed = this.pwHashServ.hash(password)

    const user = await this.userRepo.insert(
      User.newProfileOwner(email, pwHashed),
    )

    if (user.success && user.data) {
      const profileOwner = ProfileOwner.create({
        username: username,
        fullName: fullName,
        isPrivate: isPrivate,
        userId: user.data.id,
        avatar: avatar,
      })

      const insertedProfileOwner =
        await this.profileOwnerRepo.insert(profileOwner)

      if (
        insertedProfileOwner.success === false ||
        insertedProfileOwner.data === undefined
      )
        return { success: false, error: insertedProfileOwner.error }

      return { success: true, data: insertedProfileOwner.data.serialize() }
    }

    return { success: false, error: user.error }
  }
}
