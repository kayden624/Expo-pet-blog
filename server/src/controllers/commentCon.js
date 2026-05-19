import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    let { blog_id, comment, from, to, root } = req.body;

    let newComment = new Comment({
      blog_id,
      comment,
      from,
      to,
      root,
    });

    if (root) {
      // with root
      // 1: create a comment
      const commentData = await newComment.save();
      // 2:  update root comment
      await Comment.findOneAndUpdate(
        { _id: root },
        {
          isReply: Boolean(true),
          $push: { replies: commentData._id },
          $inc: { count: 1 },
        }
      );
      // 3. update from comment
      if (to) {
        await Comment.findOneAndUpdate(
          { _id: to },
          {
            isReply: Boolean(true),
            $inc: { count: 1 },
          }
        );
      }

      // 4: update blog
      await Blog.findOneAndUpdate(
        { _id: blog_id },
        {
          $inc: { "activity.total_comments": 1 },
          // $push: { comment: commentData._id },
        }
      );
      return res
        .status(200)
        .json({ msg: "create successful!", comment_id: commentData._id });
    } else {
      // no root
      // 1: create a comment
      const commentData = await newComment.save();
      // 2 : update blog
      await Blog.findOneAndUpdate(
        { _id: blog_id },
        {
          $inc: { "activity.total_comments": 1 },
          // $push: { comment: commentData._id },
        }
      );

      return res
        .status(200)
        .json({ msg: "successful", comment_id: commentData._id });
    }
  } catch (err) {
    res.status(500).json({ error });
  }
};

// get root comment
export const getCommentByBlog = async (req, res) => {
  try {
    const blog_id = req.params.blog_id;
    const page = req.params.page;
    const limit = req.params.limit;

    let maxLimit = limit ? limit : 10;
    let pageIndex = page ? page : 1;

    Blog.findOne({ blog_id: blog_id }).then((data) => {
      let queryObj = { blog_id: data._id, root: null };
      Comment.find(queryObj)
        .populate("from", "personal_info.profile_img personal_info.username")
        .populate("to", "personal_info.profile_img personal_info.username")
        .populate({
          path: "replies",
          populate: {
            path: "from",
            select: "personal_info.profile_img personal_info.username",
          },
        })
        .populate({
          path: "replies",
          populate: {
            path: "to",
            select: "personal_info.profile_img personal_info.username",
          },
        })
        .sort({ commentedAt: -1 })
        .skip((pageIndex - 1) * maxLimit)
        .limit(maxLimit)
        .then((commentList) => {
          Comment.countDocuments(queryObj).then((count) => {
            return res.status(200).json({
              results: commentList,
              totalDocs: count,
              pageIndex: pageIndex,
            });
          });
        });
    });
  } catch (err) {
    res.status(500).json({ error });
  }
};

export const getCommentById = (req, res) => {
  const comment_id = req.params.comment_id;
  Comment.findOne({ _id: comment_id })
    .populate("from", "personal_info.profile_img personal_info.username")
    .populate("to", "personal_info.profile_img personal_info.username")
    .populate({
      path: "replies",
      populate: {
        path: "from",
        select: "personal_info.profile_img personal_info.username",
      },
    })
    .populate({
      path: "replies",
      populate: {
        path: "to",
        select: "personal_info.profile_img personal_info.username",
      },
    })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

export const deleteChildrenComment = async (comment_id, commentData) => {
  try {
    // update root comment
    await Comment.findByIdAndUpdate(
      { _id: commentData.root },
      {
        $pull: { replies: comment_id },
        $inc: { count: -1 },
      }
    );
    // update blog
    await Blog.findByIdAndUpdate(
      { _id: commentData.blog_id },
      {
        $inc: { "activity.total_comments": -1 },
      }
    );
    // delete itself
    let n = await Comment.deleteOne({ _id: comment_id });
    return n.deletedCount;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const commentData = await Comment.findOne({ _id: comment_id });
    let delCounts = 0;

    if (commentData.root === null) {
      // no replies
      if (commentData.replies.length == 0) {
        await Comment.deleteOne({ _id: comment_id });

        await Blog.findByIdAndUpdate(
          { _id: commentData.blog_id },
          {
            $inc: { "activity.total_comments": -1 },
          }
        );

        delCounts = 1;
      } else {
        // with replies
        // delete all replies
        let childrenCount = commentData.count + 1;

        await Comment.deleteMany({ root: comment_id });
        // delete root
        await Comment.deleteOne({ _id: comment_id });

        await Blog.findByIdAndUpdate(
          { _id: commentData.blog_id },
          {
            $inc: { "activity.total_comments": -childrenCount },
          }
        );
        delCounts = childrenCount;
      }
    } else {
      delCounts = await deleteChildrenComment(comment_id, commentData);
    }
    return res.status(200).json({ msg: "success", delCount: delCounts });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

// new get root comment
export const getCommentByBlog2 = async (req, res) => {
  try {
    let { blogId, page, limit } = req.body;
    let maxLimit = limit ? limit : 10;
    let pageIndex = page ? page : 1;

    let blogData = await Blog.findOne({ blog_id: blogId });

    let comments = await Comment.find({ blog_id: blogData._id, root: null })
      .populate("from", "personal_info.profile_img personal_info.username")
      .populate("to", "personal_info.profile_img personal_info.username")
      .sort({ count: -1 })
      .skip((pageIndex - 1) * maxLimit)
      .limit(maxLimit);

    let counts = await Comment.countDocuments({
      blog_id: blogData._id,
      root: null,
    });

    // 处理每个评论的 replies 字段
    comments = await Promise.all(
      comments.map(async (comment) => {
        if (comment.replies && comment.replies.length > 0) {
          // 仅获取前 3 条回复
          let limitedReplies = comment.replies.slice(0, 2);

          // 获取完整的回复对象
          let fullReplies = await Comment.find({ _id: { $in: limitedReplies } })
            .populate(
              "from",
              "personal_info.profile_img personal_info.username"
            )
            .populate("to", "personal_info.profile_img personal_info.username");

          // 返回处理后的评论对象
          return {
            ...comment.toObject(), // 转换为普通对象
            replies: fullReplies,
          };
        }
        // 如果没有回复，则直接返回评论对象
        return comment.toObject();
      })
    );

    return res.status(200).json({
      results: comments,
      totalDocs: counts,
      pageIndex: pageIndex,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
