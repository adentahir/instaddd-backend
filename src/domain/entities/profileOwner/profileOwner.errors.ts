import { ConflictException, NotFoundException } from "@nestjs/common"

export class ProfileOwnerNotFound extends NotFoundException {
  constructor(email: string) {
    super(`ProfileOwner with email ${email} not found`)
  }
}

export class ProfileOwnerAlreadyExists extends ConflictException {
  constructor(id: string) {
    super(`ProfileOwner with id ${id} already exists`)
  }
}
