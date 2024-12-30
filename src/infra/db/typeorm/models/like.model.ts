import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { PostModel } from "./post.model"
import { ProfileOwnerModel } from "./profileOwner.model"

@Entity("like")
export class LikeModel {
  @PrimaryColumn("uuid", {
    name: "id",
    type: "uuid",
    unique: true,
  })
  id: string

  @Column("character varying", {
    name: "postId",
    nullable: false,
  })
  postId: string

  @Column("character varying", {
    name: "userId",
    nullable: false,
  })
  userId: string

  @Column("timestamp with time zone", {
    name: "timestamp",
    default: () => "now()",
  })
  timestamp: Date

  @ManyToOne(
    () => ProfileOwnerModel,
    profileOwner => profileOwner.likes,
    {
      onDelete: "CASCADE",
    },
  )
  profileOwner: unknown

  @ManyToOne(
    () => PostModel,
    post => post.likes,
    {
      onDelete: "CASCADE",
    },
  )
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  post: any
}
