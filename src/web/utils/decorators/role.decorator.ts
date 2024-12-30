import type { UserRole } from "@domain/entities/user/user.entity"
import { SetMetadata } from "@nestjs/common"

export const HasRole = (role: UserRole) => SetMetadata("role", role)
