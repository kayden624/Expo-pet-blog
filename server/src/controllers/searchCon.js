import Blog from "../models/Blog.js";
import User from "../models/User.js";

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.replace(regex, "<em>$1</em>");
}

export const searchBlog = async (req, res) => {
  try {
    let { keyValue, page, limit, user_id } = req.query;

    let maxLimit = limit ? limit : 10;
    let defaultPage = page ? page : 1;

    const regex = new RegExp(keyValue, "i"); // 'i' 表示不区分大小写
    const options = {
      $or: [
        { title: { $regex: regex } }, // 查询 title 字段中是否包含 titleValue
        { "content.blocks.data.text": { $regex: regex } }, // 查询 content 数组中的 text 字段是否包含 titleValue
      ],
    };
    if (user_id) {
      options.author = user_id;
    }
    // 执行查询
    const blogs = await Blog.find(options)
      .populate("author", "personal_info.username personal_info.profile_img")
      .skip((defaultPage - 1) * maxLimit)
      .limit(maxLimit);

    // 返回特定的内容
    const results = blogs.map((blog) => {
      let summer = "";
      let title = "";

      // 检查 title 是否包含 titleValue
      if (blog.title.match(regex)) {
        // matchingTexts.push(blog.title);
        title = highlightKeyword(blog.title, keyValue);
      } else {
        title = blog.title;
      }

      // 检查 content 中的 blocks.data.text 是否包含 titleValue
      blog.content.forEach((item) => {
        item.blocks.forEach((block) => {
          if (block.data.text.match(regex)) {
            // matchingTexts.push(block.data.text);
            summer = block.data.text;
            return (summer = highlightKeyword(summer, keyValue));
          }
        });
      });

      if (summer == "") {
        summer = blog.content[0].blocks[0].data.text;
      }

      return {
        blog: blog,
        title: title,
        summer: summer,
      };
    });

    // 获取总数量
    const totalDocs = await Blog.countDocuments(options);

    return res.status(200).json({
      results: results,
      totalDocs: totalDocs,
      pageIndex: defaultPage,
    });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const searchBlogCount = async (req, res) => {
  try {
    let { keyValue } = req.query;
    const regex = new RegExp(keyValue, "i"); // 'i' 表示不区分大小写

    // 执行查询
    const totalDocs = await Blog.countDocuments({
      $or: [
        { title: { $regex: regex } }, // 查询 title 字段中是否包含 titleValue
        { "content.blocks.data.text": { $regex: regex } }, // 查询 content 数组中的 text 字段是否包含 titleValue
      ],
    });

    return res.status(200).json({ msg: "success", totalDocs: totalDocs });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const searchUser = async (req, res) => {
  try {
    let { keyValue, page, limit } = req.query;

    let maxLimit = limit ? limit : 10;
    let defaultPage = page ? page : 1;

    const regex = new RegExp(keyValue, "i"); // 'i' 表示不区分大小写

    if (keyValue.trim().length === 0) {
      return res.status(200).json({ msg: "keyValue is empty!" });
    }

    let queryObj = {
      "personal_info.username": { $regex: regex },
    };
    const usersList = await User.find(queryObj)
      .select("-personal_info.password -blogs -following")
      .skip((defaultPage - 1) * maxLimit)
      .limit(maxLimit);

    const totalDocs = await User.countDocuments(queryObj);

    return res.status(200).json({
      results: usersList,
      totalDocs: totalDocs,
      pageIndex: defaultPage,
    });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};

export const getSearchUserCount = async (req, res) => {
  try {
    let { keyValue } = req.query;
    const regex = new RegExp(keyValue, "i");

    if (keyValue.trim().length === 0) {
      return res.status(200).json({ msg: "keyValue is empty!" });
    }

    let queryObj = {
      "personal_info.username": { $regex: regex },
    };

    const totalDocs = await User.countDocuments(queryObj);

    return res.status(200).json({ msg: "success", totalDocs: totalDocs });
  } catch (error) {
    res.status(500).json({ msg: "fail", err: error });
    throw error;
  }
};
