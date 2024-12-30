import {
  AddPostDto,
  LikeOrUndoLikePostDto,
  UpdatePostDto,
} from "@app/dtos/post.dto"
import { AuthService } from "@app/services/auth.service"
import { PostService } from "@app/services/post.service"
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
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async addPost(@Body() body: unknown) {
    const dto = AddPostDto.create(body).unwrap()
    return await this.postService.AddPost(dto)
  }

  @Delete("")
  async removePost(@Query() query: unknown) {
    const dto = UUID.create(query).unwrap()
    return await this.postService.RemovePost(dto)
  }

  @Put("")
  async updatePost(@Body() body: unknown) {
    const dto = UpdatePostDto.create(body).unwrap()
    return await this.postService.UpdatePost(dto)
  }

  @Get("/:id")
  async getPosts(@Param("id") id: UUID) {
    const dto = UUID.create(id).unwrap()
    return await this.postService.FetchPostForProfile(dto)
  }

  @Post("/:id/like")
  async likePost(@Param("id") postId: UUID, @Body() body: unknown) {
    const dto = LikeOrUndoLikePostDto.create(body, postId).unwrap()
    return await this.postService.LikeOrUndoLikePost(dto)
  }
}
