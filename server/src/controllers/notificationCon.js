import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async (req, res) => {
  try {
    let requestObj = req.body;

    const defaultTypeArr = [
      "likeBlog",
      "followUser",
      "createBlog",
      "comment",
      "reply",
    ];

    // 收藏有专门的列表查询，不放在动态通知中

    if (!requestObj.type || !requestObj.user) {
      return res.status(403).json({ msg: "fail", err: "error request value" });
    }

    if (!defaultTypeArr.includes(requestObj.type)) {
      return res.status(403).json({ msg: "fail", err: "error type value" });
    }

    if (requestObj.type.includes("Blog") && !requestObj.blog) {
      return res.status(403).json({ msg: "fail", err: "miss blog" });
    }

    let newNotification = new Notification(requestObj);

    await newNotification.save();

    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const getNotificationList = async (req, res) => {
  try {
    const userId = req.params.user_id;
    let { limit, page } = req.body;

    let maxLimit = limit ? limit : 10;
    let defaultPage = page ? page : 1;

    const userData = await User.findOne({ userId });

    if (!userData) {
      return res.status(403).json({ msg: "fail", err: "error user value" });
    }
    const results = await Notification.find({ user: userData._id })
      .populate("blog", "title banner blog_id")
      .populate("user", "personal_info.username personal_info.profile_img")
      .populate(
        "followedUser",
        "userId personal_info.username personal_info.profile_img personal_info.bio activity.total_posts activity.total_verified_followers activity.total_following"
      )
      .populate(
        "notification_for",
        "personal_info.username personal_info.profile_img personal_info.bio activity.total_posts activity.total_verified_followers"
      )
      .populate("comment", "comment")
      .populate("replied_on_comment", "comment")
      .sort({ createdAt: -1 })
      .skip((defaultPage - 1) * maxLimit)
      .limit(maxLimit);

    const totalDocs = await Notification.countDocuments({ user: userData._id });

    res
      .status(200)
      .json({ results: results, totalDocs: totalDocs, pageIndex: defaultPage });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const getNotice = async (req, res) => {
  try {
    let user_id = req.user;

    let page = req.params.page;
    let limit = req.params.limit;
    let type = req.params.type;

    let maxLimit = limit ? limit : 10;
    let defaultPage = page ? page : 1;

    if (!["comment", "reply"].includes(type)) {
      return res.status(403).json({ msg: "wrong input" });
    }

    const queryObj = {
      type: type,
      user: { $ne: user_id },
      notification_for: user_id,
    };

    let results = await Notification.find(queryObj)
      .populate("comment", "comment")
      .populate("blog", "blog_id title")
      .populate("user", "personal_info.username personal_info.profile_img")
      .populate("replied_on_comment", "comment")
      .skip((defaultPage - 1) * maxLimit)
      .limit(maxLimit);

    let counts = await Notification.countDocuments(queryObj);

    return res
      .status(200)
      .json({ results, totalDocs: counts, pageIndex: defaultPage });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let requestObj = req.body;

    const defaultTypeArr = ["likeBlog", "followUser", "comment", "reply"];

    if (!requestObj.type || !requestObj.user) {
      return res.status(403).json({ msg: "fail", err: "error request value" });
    }

    if (!defaultTypeArr.includes(requestObj.type)) {
      return res.status(403).json({ msg: "fail", err: "error type value" });
    }

    if (requestObj.type === "comment") {
      await Notification.deleteMany({
        type: "reply",
        user: requestObj.user,
        blog: requestObj.blog,
        replied_on_comment: requestObj.comment,
      });
    }
    await Notification.deleteMany(requestObj);

    res.status(200).json({ msg: "successful" });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};
