import { ConflictException, NotFoundException } from "@nestjs/common"

export class CommentNotFound extends NotFoundException {
  constructor(id: string) {
    super(`Comment with id ${id} not found`)
  }
}

export class CommentAlreadyExists extends ConflictException {
  constructor(id: string) {
    super(`Comment with id ${id} already exists`)
  }
}
