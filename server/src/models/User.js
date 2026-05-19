import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    personal_info: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: String,
      username: {
        type: String,
        minlength: [3, "名称不能少于3位"],
        required: true,
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_img: {
        type: String,
        default: () => {
          return "http://192.168.0.120:3001/default_img.png";
        },
      },
    },
    activity: {
      total_posts: {
        type: Number,
        default: 0,
      },
      // 正在关注
      total_following: {
        type: Number,
        default: 0,
      },
      //粉丝数
      total_verified_followers: {
        type: Number,
        default: 0,
      },
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
    // 关注的用户内容
    following: {
      type: [Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    // 粉丝
    verified_followers: {
      type: [Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default mongoose.model("users", userSchema);
