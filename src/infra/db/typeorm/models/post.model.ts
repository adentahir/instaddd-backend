import { Like } from "@domain/entities/post/post.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { CommentModel } from "./comment.model"
import { LikeModel } from "./like.model"
import { ProfileOwnerModel } from "./profileOwner.model"

@Entity("post")
export class PostModel {
  @PrimaryColumn("uuid", {
    name: "id",
    type: "uuid",
    unique: true,
  })
  id: string

  @Column("character varying", {
    name: "caption",
    nullable: false,
    length: 128,
  })
  caption: string

  @Column("simple-array", {
    name: "media",
    nullable: false,
  })
  media: string[]

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

  @ManyToOne(
    () => ProfileOwnerModel,
    profileOwner => profileOwner.posts,
    {
      onDelete: "CASCADE",
    },
  )
  profileOwner: unknown

  @OneToMany(
    () => CommentModel,
    comment => comment.post,
    {
      cascade: true,
    },
  )
  comments: CommentModel[]

  @OneToMany(
    () => LikeModel,
    like => like.post,
    {
      cascade: true,
    },
  )
  likes: LikeModel[]
}
