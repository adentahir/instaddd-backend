import { UserRole } from "@domain/entities/user/user.entity"
import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm"
import { ProfileOwnerModel } from "./profileOwner.model"

@Entity("user")
export class UserModel {
  @PrimaryColumn("uuid", {
    name: "id",
    type: "uuid",
    unique: true,
  })
  id: string

  @Column("character varying", {
    name: "password",
    nullable: false,
    length: 128,
  })
  password: string

  @Column("character varying", {
    name: "email",
    length: 128,
    unique: true,
  })
  email: string

  @Column("character varying", {
    name: "role",
    length: 128,
  })
  role: UserRole

  @Column("character varying", { name: "refresh_token" }) refreshToken: string

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date

  @Column("timestamp with time zone", {
    name: "updated_at",
    default: () => "now()",
  })
  updatedAt: Date

  @OneToOne(
    () => ProfileOwnerModel,
    profileOwner => profileOwner.user,
    {
      onDelete: "CASCADE",
    },
  )
  profileOwner: ProfileOwnerModel
}
