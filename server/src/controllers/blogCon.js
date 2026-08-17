import { nanoid } from "nanoid";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getFullDate } from "./utility.js";

/**
 * 创建或更新博客
 * @param {Object} req - 请求对象，包含用户ID和博客内容
 * @param {Object} res - 响应对象
 * 功能：处理博客的创建和更新，验证必填字段，生成唯一博客ID
 */
export const createBlog = (req, res) => {
  // _id 作为authorId 存储
  let authorId = req.user;
  let { title, banner, tags, content, draft, id } = req.body;
  // console.log(content);

  if (!title.length) {
    return res
      .status(403)
      .json({ error: "You must provide a title to publish the blog" });
  }

  if (!draft) {
    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "You must provide blog banner to publish it" });
    }

    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "There must be some blog content to publish it" });
    }

    if (!tags.length || tags.length > 10) {
      return res.status(403).json({
        error: "Provide tags in order to publish the blog, Maximum 10",
      });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());

  // let blogId =
  //   id ||
  //   title
  //     .replace(/[^a-zA-Z0-9]/g, " ")
  //     .replace(/\s+/g, "-")
  //     .trim() + nanoid();

  let blogId = getFullDate() + nanoid();

  if (id) {
    Blog.findOneAndUpdate(
      { blog_id: id, author: authorId },
      {
        title,
        banner,
        tags,
        content,
      }
    )
      .then((data) => {
        if (!data) return res.status(404).json({ error: "Blog not found or access denied" });
        return res.status(200).json({ data });
      })
      .catch((err) => {
        return res.status(500).json({ err });
      });
  } else {
    // create
    let newBlog = new Blog({
      title,
      banner,
      tags,
      content,
      author: authorId,
      blog_id: blogId,
      draft: Boolean(draft),
    });

    newBlog
      .save()
      .then((data) => {
        let incrementVal = draft ? 0 : 1;

        // update user
        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "activity.total_posts": incrementVal },
            $push: { blogs: data._id },
          }
        )
          .then((user) => {
            return res.status(200).json({ id: data._id });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Fail to update posts number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error });
      });
  }
};

/**
 * 获取博客列表
 * @param {Object} req - 请求对象，包含分页参数和用户ID
 * @param {Object} res - 响应对象
 * 功能：获取指定用户的已发布博客列表，支持分页
 */
export const getBlogList = (req, res) => {
  let { limit, page, userId } = req.query;

  let maxLimit = limit ? limit : 10;

  let pipeline = [];

  let counts = 0;
  // 需要使用userId在users集合里面找 _id,然后用_id在blogs查找author == _id
  pipeline.push(
    {
      $match: {
        userId: userId,
      },
    },
    {
      $lookup: {
        from: "blogs",
        let: { user_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$author", "$$user_id"] },
                  { $eq: ["$draft", false] },
                ],
              },
            },
          },
          { $project: { title: 1, banner: 1, blog_id: 1, publishedAt: 1 } },
        ],
        as: "user_blogs",
      },
    },
    {
      $unwind: "$user_blogs",
    },
    {
      $project: {
        author: {
          userId: "$userId",
          personal_info: {
            username: "$personal_info.username",
            profile_img: "$personal_info.profile_img",
            bio: "$personal_info.bio",
          },
        },
        blog: "$user_blogs",
      },
    }
  );

  User.aggregate(pipeline)
    .then((filterdBlogs) => {
      counts = filterdBlogs.length;

      let paginatedPipeline = [...pipeline];
      paginatedPipeline.push({ $skip: (page - 1) * maxLimit });
      paginatedPipeline.push({ $limit: Number(maxLimit) });

      return User.aggregate(paginatedPipeline);
    })
    .then((paginatedResults) => {
      return res.status(200).json({
        results: paginatedResults,
        totalDocs: counts,
        pageIndex: page,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error });
    });
};

/**
 * 获取单个博客内容
 * @param {Object} req - 请求对象，包含博客ID和模式(edit/view)
 * @param {Object} res - 响应对象
 * 功能：获取单个博客的详细内容，阅读模式下会增加阅读计数
 */
export const getBlog = (req, res) => {
  const blog_id = req.params.blog_id;
  const mode = req.params.mode;
  let incrementVal = mode != "edit" ? 1 : 0;

  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementVal } }
  )
    .populate(
      "author",
      "personal_info.username personal_info.profile_img personal_info.bio userId following verified_followers "
    )
    .then((blog) => {
      return res.status(200).json({ blog });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

/**
 * 处理博客点赞
 * @param {Object} req - 请求对象，包含用户ID和博客ID
 * @param {Object} res - 响应对象
 * 功能：切换用户对博客的点赞状态，更新点赞计数
 */
export const handleBlogLikes = (req, res) => {
  let user_id = req.user;
  // mongodb 自有的_id
  const _id = req.params.blog_id;

  Blog.findOne({ _id, liked_users: user_id }).then((isliked) => {
    let incrementVal = !isliked ? 1 : -1;

    if (!isliked) {
      // not like,add like user
      Blog.findOneAndUpdate(
        { _id },
        {
          $inc: { "activity.total_likes": incrementVal },
          $push: { liked_users: user_id },
        }
      )
        .then(() => {
          return res.status(200).json({ msg: "success" });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    } else {
      // cancel like , remove liked user
      Blog.findOneAndUpdate(
        { _id },
        {
          $inc: { "activity.total_likes": incrementVal },
          $pull: { liked_users: user_id },
        }
      )
        .then(() => {
          return res.status(200).json({ msg: "success" });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    }
  });
};

/**
 * 收藏/取消收藏博客
 * @param {Object} req - 请求对象，包含用户ID和博客ID
 * @param {Object} res - 响应对象
 * 功能：切换用户对博客的收藏状态
 */
export const handleBlogFollow = async (req, res) => {
  // request params: Blog.blog_id User._id
  try {
    let user_id = req.user;
    const blog_id = req.params.blog_id;

    const isFollowed = await Blog.findOne({ blog_id, followed_users: user_id });

    if (!isFollowed) {
      await Blog.findOneAndUpdate(
        { blog_id },
        {
          $push: { followed_users: user_id },
        }
      );
    } else {
      await Blog.findOneAndUpdate(
        { blog_id },
        {
          $pull: { followed_users: user_id },
        }
      );
    }

    return res.status(200).json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 获取热门博客
 * @param {Object} req - 请求对象，包含分页参数
 * @param {Object} res - 响应对象
 * 功能：获取按发布时间和点赞数排序的热门博客列表
 */
export const getHotBlogs = (req, res) => {
  let { limit, page } = req.query;

  let maxLimit = limit ? limit : 3;

  let queryObj = { draft: false };

  Blog.find(queryObj)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username -_id "
    )
    .select("blog_id activity title banner publishedAt")
    .sort({ publishedAt: -1, "activity.total_likes": -1 })
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      Blog.countDocuments(queryObj).then((count) => {
        return res
          .status(200)
          .json({ results: blogs, totalDocs: count, pageIndex: page });
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

/**
 * 获取用户关注的博客
 * @param {Object} req - 请求对象，包含用户ID和分页参数
 * @param {Object} res - 响应对象
 * 功能：获取用户关注的其他用户发布的博客列表
 */
export const getFollowedByUserBlogs = (req, res) => {
  let authorId = req.user;

  let { limit, page } = req.query;

  let maxLimit = limit ? limit : 3;

  User.findOne({ _id: authorId })
    .then((filterUser) => {
      if (!filterUser) {
        return res.status(403).json({ msg: "用户不存在！" });
      }
      return filterUser.following;
    })
    .then((followedUser) => {
      let queryObj = { author: followedUser, draft: false };

      Blog.find({ author: followedUser, draft: false })
        .populate(
          "author",
          "personal_info.profile_img personal_info.username -_id "
        )
        .select("activity blog_id title banner publishedAt")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((data) => {
          Blog.countDocuments(queryObj).then((count) => {
            return res
              .status(200)
              .json({ results: data, totalDocs: count, pageIndex: page });
          });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

/**
 * 获取用户收藏的博客
 * @param {Object} req - 请求对象，包含用户ID和分页参数
 * @param {Object} res - 响应对象
 * 功能：获取用户收藏的博客列表
 */
export const getFollowedBlogs = (req, res) => {
  try {
    let { limit, page, userId } = req.query;

    let maxLimit = limit ? limit : 8;

    User.findOne({ userId }).then((filterUser) => {
      if (!filterUser) {
        return res.status(403).json({ msg: "用户不存在！" });
      }

      let queryObj = { followed_users: filterUser._id, draft: false };

      Blog.find(queryObj)
        .select("title blog_id banner")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((filterBlogs) => {
          Blog.countDocuments(queryObj).then((counts) => {
            return res.status(200).json({
              results: filterBlogs,
              totalDocs: counts,
              pageIndex: page,
            });
          });
        });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 删除博客
 * @param {Object} req - 请求对象，包含博客ID和用户ID
 * @param {Object} res - 响应对象
 * 功能：删除博客及相关数据(评论、通知)，更新用户统计
 */
export const deleteBlog = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    // _id 作为authorId 存储
    let user_id = req.user;
    const deleted = await Blog.deleteOne({ _id: blog_id, author: user_id });
    if (!deleted.deletedCount) return res.status(404).json({ error: "Blog not found or access denied" });
    // delete related records only after ownership is verified
    await Notification.deleteMany({ blog: blog_id });
    await Comment.deleteMany({ blog_id: blog_id });
    //update user
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        $pull: { blogs: blog_id },
        $inc: { "activity.total_posts": -1 },
      }
    );

    return res.status(200).json({ msg: "success" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
