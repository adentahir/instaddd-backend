import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"

export class UserNotFound extends NotFoundException {
  constructor(email: string) {
    super(`User with email ${email} not found`)
  }
}

export class UserAlreadyExists extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} already exists`)
  }
}

export class InvalidCredentials extends UnauthorizedException {
  constructor() {
    super("Invalid credentials")
  }
}
