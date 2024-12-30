import { PaginationDto } from "@app/dtos/pagnation.dto"
import {
  FindProfileDto,
  FollowOrUnfollowProfileDto,
  UpdateProfileDto,
  UploadDto,
} from "@app/dtos/user.dto"
import { PostService } from "@app/services"
import { ProfileService } from "@app/services/profile.service"
import { UUID } from "@carbonteq/hexapp"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { extractFileDetails } from "@web/utils/common/extract-file"
import {
  MultipartFastify,
  MultipartFastifyData,
} from "@web/utils/decorators/multipart-fastify.decorator"
import { Public } from "@web/utils/decorators/public.decorators"

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly postService: PostService,
  ) {}

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

  @Public()
  @Post("uploadProfileImage")
  async uploadProfileImage(
    @MultipartFastify("avatar") avatar: MultipartFastifyData,
  ) {
    const { buff } = await extractFileDetails(avatar.file)
    return await this.profileService.uploadProfileImage(buff)
  }

  @Put("followOrUnfollowProfile")
  async followOrUnfollowProfile(@Body() body: unknown) {
    const dto = FollowOrUnfollowProfileDto.create(body).unwrap()
    return await this.profileService.followOrUnfollowProfile(dto)
  }

  @Get("/:id/posts")
  async getFeed(@Param("id") id: string, @Query() query: unknown) {
    const Id = UUID.create(id).unwrap()
    const dto = PaginationDto.create(query).unwrap()

    const posts = await this.postService.FetchFeedForProfileOwner(Id, dto)

    if (!posts.success || !posts.data)
      return { success: false, error: posts.error }
    return posts
  }

  @Get("/:id")
  async getProfile(@Req() req, @Param("id") id: string) {
    const dto = UUID.create(id).unwrap()
    const user = await this.profileService.fetchUser(dto)
    if (!user.success || !user.data)
      return { success: false, error: user.error }
    return user.data.serialize()
  }
}
