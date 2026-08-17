import bcrypt from "bcryptjs";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../models/User.js";

const validateEmail = function (email) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return passwordRegex.test(password);
};

const formatedUserDataToSend = (data) => {
  const access_token = jwt.sign(
    { id: data._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  return {
    access_token,
    username: data.personal_info.username,
    profile_img: data.personal_info.profile_img,
    userId: data.userId,
    _id: data._id,
  };
};

export const signup = async (req, res) => {
  let { email, password } = req.body; // Check if the email field exists

  if (!email) {
    return res.status(403).json({ error: "Please provide an email address!" });
  }

  const newUserId = nanoid();
  const newUsername = email.split("@")[0] + nanoid();

  if (!validateEmail(email)) {
    return res.status(403).json({ error: "Invalid email address!" });
  }

  console.log("email:", email);
  if ((await User.exists({ "personal_info.email": email })) !== null) {
    return res
      .status(500)
      .json({ error: "This email address is already taken." });
  }

  if (!validatePassword(password)) {
    return res.status(403).json({
      error:
        "Password does not meet the requirements. It should be 6 - 20 characters long and contain uppercase, lowercase letters and numbers!",
    });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Password encryption failed. Please try again later!" });
    }

    const newUser = new User({
      userId: newUserId,
      personal_info: {
        email,
        password: hashed_password,
        username: newUsername,
      },
    });

    try {
      const data = await newUser.save();
      return res.status(200).json(formatedUserDataToSend(data));
    } catch (err) {
      if (err.message.indexOf("E11000 duplicate key error") !== -1) {
        console.log("Duplicate key exists", err.keyPattern, err);
      }
      if (err.keyValue) {
        Object.entries(err.keyValue).map(([key, value]) => {
          console.log(`error:${key}: ${value}`);
        });
      }
      res
        .status(500)
        .json({ error: "Failed to create user. Please try again later!" });
    }
  });
};

export const login = async (req, res) => {
  let { email, password } = req.body;

  await User.findOne({
    "personal_info.email": email,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(403)
          .json({ error: "This email address does not exist." });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(403).json({
            error: "An error occurred during login. Please try again.",
          });
        }

        if (!result) {
          return res
            .status(403)
            .json({ error: "Incorrect email or password." });
        } else {
          return res.status(200).json(formatedUserDataToSend(user));
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const updateProfile = async (req, res) => {
  let _id = req.user;
  const queryObj = req.body;

  let updateObj = {
    "personal_info.username": queryObj.username,
    "personal_info.bio": queryObj.bio,
    "personal_info.profile_img": queryObj.profile_img,
    "personal_info.email": queryObj.email,
  };

  await User.findByIdAndUpdate({ _id }, { ...updateObj }, { new: true })
    .select("-_id -updatedAt -personal_info.password")
    .then((data) => {
      return res.status(200).json({ status: "success", user: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const getProfile = async (req, res) => {
  const id = req.params.userId;
  await User.findOne({ userId: id })
    .select("-_id -updatedAt -personal_info.password")
    .then((data) => {
      return res.status(200).json({ status: "success", user: data });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const verifiedPassword = async (req, res) => {
  let _id = req.user;
  let { old_password } = req.body;

  await User.findById({ _id })
    .then((user) => {
      bcrypt.compare(
        old_password,
        user.personal_info.password,
        (err, result) => {
          if (err) {
            return res.status(403).json({
              error:
                "An error occurred during password verification. Please try again.",
            });
          }

          if (!result) {
            return res
              .status(403)
              .json({ error: "Password verification failed!" });
          } else {
            return res.status(200).json({ status: "success" });
          }
        }
      );
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const updatePassword = async (req, res) => {
  let _id = req.user;
  let { password, password_confirmed } = req.body;

  if (!password || !password_confirmed) {
    return res.status(403).json({ error: "Please enter a password." });
  }

  if (password !== password_confirmed) {
    return res.status(403).json({
      error:
        "The two passwords you entered do not match. Please modify and submit again!",
    });
  }

  if (!validatePassword(password) || !validatePassword(password_confirmed)) {
    return res
      .status(403)
      .json({ error: "Does not meet the password combination rules!" });
  }

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    await User.findByIdAndUpdate(
      { _id },
      { "personal_info.password": hashed_password }
    )
      .then((data) => {
        return res.status(200).json({ status: "success" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete({ _id: req.user })
    .then(() => {
      return res.status(200).json({ status: "success" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

export const followedUser = async (req, res) => {
  let user_id = req.user;
  let { followUserId } = req.body;

  try {
    let followedId = await User.findOne({ userId: followUserId });

    if (followedId._id == user_id) {
      return res.status(200).json({ msg: "You cannot follow yourself." });
    }
    followedId = followedId._id;

    await User.findOne({ _id: user_id, following: followedId._id }).then(
      async (isfollowed) => {
        let incrementVal = !isfollowed ? 1 : -1;

        if (!isfollowed) {
          await User.findOneAndUpdate(
            { _id: user_id },
            {
              $push: {
                following: followedId._id,
              },
              $inc: { "activity.total_following": incrementVal },
            }
          );

          await User.findOneAndUpdate(
            { _id: followedId._id },
            {
              $push: {
                verified_followers: user_id,
              },
              $inc: { "activity.total_verified_followers": incrementVal },
            }
          );
        } else {
          await User.findOneAndUpdate(
            {
              _id: user_id,
            },
            {
              $pull: {
                following: followedId._id,
              },
              $inc: { "activity.total_following": incrementVal },
            }
          );

          await User.findOneAndUpdate(
            { _id: followedId._id },
            {
              $pull: {
                verified_followers: user_id,
              },
              $inc: { "activity.total_verified_followers": incrementVal },
            }
          );
        }
        return res.status(200).json({ msg: "success" });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFollowingUsers = (req, res) => {
  try {
    let { limit, page, userId } = req.query;

    let maxLimit = limit ? limit : 8;

    User.findOne({ userId }).then((filterUser) => {
      if (!filterUser) {
        return res.status(403).json({ msg: "用户不存在！" });
      }

      let queryObj = { following: filterUser._id };

      User.find(queryObj)
        .select(
          "userId personal_info.email personal_info.email personal_info.username personal_info.profile_img"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((filterUsers) => {
          User.countDocuments(queryObj).then((counts) => {
            return res.status(200).json({
              results: filterUsers,
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

export const getFollowedUsers = (req, res) => {
  try {
    let { limit, page, userId } = req.query;

    let maxLimit = limit ? limit : 8;

    User.findOne({ userId }).then((filterUser) => {
      if (!filterUser) {
        return res.status(403).json({ msg: "用户不存在！" });
      }

      let queryObj = { verified_followers: filterUser._id };

      User.find(queryObj)
        .select(
          "userId personal_info.email personal_info.email personal_info.username personal_info.profile_img"
        )
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((filterUsers) => {
          User.countDocuments(queryObj).then((counts) => {
            return res.status(200).json({
              results: filterUsers,
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

export const checkEmailExists = async (req, res) => {
  const { email } = req.body; // 检查是否提供了邮箱

  if (!email) {
    return res.status(403).json({ error: "请提供邮箱地址!" });
  } // 验证邮箱格式

  if (!validateEmail(email)) {
    return res.status(403).json({ error: "邮箱格式不正确!" });
  }

  try {
    // 查询数据库中是否存在该邮箱
    const existingUser = await User.exists({ "personal_info.email": email });

    return res.status(200).json({
      exists: existingUser !== null,
      message: existingUser ? "该邮箱已被注册" : "该邮箱可以使用",
    });
  } catch (err) {
    return res.status(500).json({
      error: "查询邮箱时发生错误，请稍后重试",
      details: err.message,
    });
  }
};
