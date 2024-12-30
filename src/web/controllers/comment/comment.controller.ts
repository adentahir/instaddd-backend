import { AddCommentDto, UpdateCommentDto } from "@app/dtos/comment.dto"
import { CommentService } from "@app/services/comment.service"
import { UUID } from "@carbonteq/hexapp"
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("comments")
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentService) {}

  @Post("")
  async addComment(@Body() body: unknown) {
    const dto = AddCommentDto.create(body).unwrap()
    return await this.commentsService.addComment(dto)
  }

  @Put("/:id")
  async updateComment(@Param("id") id: UUID, @Body() body: unknown) {
    const dto = UpdateCommentDto.create(body).unwrap()
    return await this.commentsService.updateComment(dto)
  }

  @Delete("/:id")
  async removeComment(@Param("id") id: UUID) {
    const dto = UUID.create(id).unwrap()
    return await this.commentsService.removeComment(dto)
  }

  @Get("/post/:postId")
  async getCommentsByPost(@Param("postId") postId: UUID) {
    const dto = UUID.create(postId).unwrap()
    return await this.commentsService.getAllComments(dto)
  }
}
