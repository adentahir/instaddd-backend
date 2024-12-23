import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import { PostModel } from "./post.model"
import { ProfileOwnerModel } from "./profileOwner.model"

@Entity("comment")
export class CommentModel {
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
    name: "message",
    nullable: false,
  })
  message: string

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

  // many to one relationship with profileOwner

  @ManyToOne(
    () => ProfileOwnerModel,
    profileOwner => profileOwner.comments,
    {
      onDelete: "CASCADE",
    },
  )
  profileOwner: ProfileOwnerModel

  @ManyToOne(
    () => PostModel,
    post => post.comments,
    {
      onDelete: "CASCADE",
    },
  )
  post: PostModel

  @ManyToOne(
    () => CommentModel,
    comment => comment.replies,
    {
      nullable: true,
    },
  )
  replyTo: CommentModel

  @OneToMany(
    () => CommentModel,
    comment => comment.replyTo,
  )
  replies: CommentModel[]
}
