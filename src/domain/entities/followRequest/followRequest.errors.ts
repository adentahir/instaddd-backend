import { ConflictException, NotFoundException } from "@nestjs/common"

export class FollowRequestNotFound extends NotFoundException {
  constructor(id: string) {
    super(`Follow Request with id ${id} not found`)
  }
}

export class FollowRequestAlreadyExists extends ConflictException {
  constructor(id: string) {
    super(`Follow Request with id ${id} already exists`)
  }
}
