import {
  FindProfileDto,
  FollowOrUnfollowProfileDto,
  UpdateProfileDto,
  UploadDto,
} from "@app/dtos/user.dto"
import { ProfileService } from "@app/services/profile.service"
import { UUID } from "@carbonteq/hexapp"
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly profileService: ProfileService) {}

  @Put("updateProfile")
  async updateProfile(@Body() body: unknown) {
    const dto = UpdateProfileDto.create(body).unwrap()
    return await this.profileService.updateProfile(dto)
  }

  @Get("findProfile")
  async findProfile(@Query() query: unknown) {
    const dto = FindProfileDto.create(query).unwrap()
    return await this.profileService.findProfile(dto)
  }

  @Delete("deleteProfile")
  async deleteProfile(@Query() query: unknown) {
    const dto = UUID.create(query).unwrap()
    return await this.profileService.deleteProfile(dto)
  }

  @Post("uploadProfileImage")
  async uploadProfileImage(@Body() body: unknown) {
    const dto = UploadDto.create(body).unwrap()
    return await this.profileService.uploadProfileImage(dto)
  }

  @Put("followOrUnfollowProfile")
  async followOrUnfollowProfile(@Body() body: unknown) {
    const dto = FollowOrUnfollowProfileDto.create(body).unwrap()
    return await this.profileService.followOrUnfollowProfile(dto)
  }
}
