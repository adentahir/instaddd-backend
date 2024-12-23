import { ConflictException, NotFoundException } from "@nestjs/common"

export class PostNotFound extends NotFoundException {
  constructor(id: string) {
    super(`Post with id ${id} not found`)
  }
}

export class PostAlreadyExists extends ConflictException {
  constructor(id: string) {
    super(`Post with id ${id} already exists`)
  }
}
