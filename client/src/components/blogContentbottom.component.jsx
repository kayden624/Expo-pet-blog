import { useContext, useEffect } from "react";
import Loader from "./loader.component";
import { UserAuthContext } from "./../hooks/userAuthContext";
import { Toaster, toast } from "react-hot-toast";
import newRequest from "../servers";
import { Link } from "react-router-dom";
import { BlogPageContext } from "../pages/blog.page";

const BlogContentBottomComponent = () => {
  // 获取URL参数中的博客ID
  const {
    userAuth: { access_token, userId, _id },
  } = useContext(UserAuthContext);

  let total_likes = 0;
  const {
    blog,
    blog: {
      activity,
    },
    setBlog,
    isFollowedByUser,
    setFollowedByUser,
    isLikedByUser,
    setLikeddByUser,
    isFollowedByBlog,
    setFollowedByBlog,
  } = useContext(BlogPageContext);

  // 处理点赞操作
  const handleLike = (flag) => {
    if (access_token) {
      // 切换点赞状态
      setLikeddByUser((preVal) => !preVal);
      // 根据点赞状态更新点赞总数
      flag ? total_likes-- : total_likes++;
      setBlog({
        ...blog,
        activity: { ...activity, total_likes },
      });

      // 发送点赞请求
      newRequest
        .post(
          `/blog/${blog._id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(() => {
          // 更新通知
          if (flag) {
            // 删除通知
            newRequest
              .delete("/notification", {
                data: { type: "likeBlog", blog: blog._id, user: _id },
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              })
              .then(() => {
                console.log("Notification deleted");
              })
              .catch((error) => {
                console.error("Error deleting notification:", error);
              });
          } else {
            // 创建通知
            newRequest
              .post(
                "/notification",
                { type: "likeBlog", blog: blog._id, user: _id },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              )
              .then(() => {
                console.log("Notification created");
              })
              .catch((error) => {
                console.error("Error creating notification:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error liking blog:", error);
        });
    } else {
      // 未登录提示
      toast.error("Please log in first!");
    }
  };

  // 处理关注用户操作
  const handleFollow = (flag) => {
    if (access_token) {
      // 切换关注状态
      flag = flag === 1 ? 0 : 1;
      setFollowedByUser(flag);
      // 发送关注请求
      newRequest
        .post(
          "/user/follow",
          { followUserId: blog.author.userId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(() => {
          // 操作成功提示
          toast.success("Operation successful");
          // 根据关注状态创建或删除通知
          if (flag === 1) {
            newRequest
              .post(
                "/notification",
                {
                  type: "followUser",
                  user: _id,
                  followedUser: blog.author._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              )
              .then(() => {
                console.log("Notification created");
              })
              .catch((error) => {
                console.error("Error creating notification:", error);
              });
          } else {
            newRequest
              .delete("/notification", {
                data: {
                  type: "followUser",
                  user: _id,
                  followedUser: blog.author._id,
                },
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              })
              .then(() => {
                console.log("Notification deleted");
              })
              .catch((error) => {
                console.error("Error deleting notification:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error following user:", error);
        });
    } else {
      // 未登录提示
      toast.error("Please log in first!");
    }
  };

  // 获取用户是否关注作者的状态
  const getFollowedByUser = () => {
    if (userId === blog.author.userId) {
      setFollowedByUser(2);
    } else {
      if (blog.author.verified_followers.includes(_id)) {
        setFollowedByUser(1);
      } else {
        setFollowedByUser(0);
      }
    }
  };

  // 获取用户是否点赞博客的状态
  const getLikedByUser = () => {
    if (blog.liked_users.includes(_id)) {
      setLikeddByUser(true);
    } else {
      setLikeddByUser(false);
    }
  };

  // 获取用户是否收藏博客的状态
  const getFollowedByBlog = () => {
    if (blog.followed_users && blog.followed_users.includes(_id)) {
      setFollowedByBlog(true);
    } else {
      setFollowedByBlog(false);
    }
  };

  // 处理收藏博客操作
  const handleBlogFollow = () => {
    if (access_token) {
      // 发送收藏请求
      newRequest
        .post(
          `/blog/${blog._id}/follow`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(() => {
          // 切换收藏状态
          setFollowedByBlog((preVal) => !preVal);
          // 根据收藏状态提示成功或取消收藏
          !isFollowedByBlog
            ? toast.success("Successfully bookmarked")
            : toast.success("Bookmark removed");
        })
        .catch((err) => {
          console.error("Error following blog:", err);
        });
    } else {
      // 未登录提示
      toast.error("Please log in.");
    }
  };

  useEffect(() => {
    if (blog.author) {
      getFollowedByUser();
      getLikedByUser();
      getFollowedByBlog();
    }
  }, [blog.author, blog.liked_users]);

  // 如果博客信息为空，显示加载器
  return Object.keys(blog).length === 0 ? (
    <Loader />
  ) : (
    <div className="bg-white w-[100%]">
      <Toaster />
      <div className="mx-auto max-w-[664px] pt-[160px]">
        {/* 显示博客标签 */}
        <div className="flex flex-wrap gap-3 text-dark-grey mb-6">
          {blog.tags.map((tag, i) => {
            return (
              <div key={i} className="bg-grey px-2">
                # {tag}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          {/* 点赞按钮 */}
          <button
            className={
              "bg-grey p-3 rounded-md " +
              (isLikedByUser ? "bg-red text-white " : "")
            }
            onClick={() => handleLike(isLikedByUser)}
          >
            <i className="fi fi-rr-bolt mr-1"></i>
            {total_likes}
          </button>
          {/* 显示最新点赞用户 */}
          {blog.liked_users.length > 0 ? (
            <div className="flex">
              <p>Latest user who liked: {blog.liked_users[0]}</p>
            </div>
          ) : null}

          {/* 收藏按钮 */}
          <div>
            <button onClick={handleBlogFollow}>
              {!isFollowedByBlog ? (
                <i className="fi fi-rs-bin-bottles"></i>
              ) : (
                <i className="fi fi-sr-bin-bottles text-red"></i>
              )}
            </button>
          </div>
        </div>
        {/* 分割线 */}
        <span className=" border-b-2 border-grey w-[100%] block my-4"></span>
        {/* 用户信息 */}
        <div className="flex justify-center gap-3">
          <Link to={`/user/${blog.author.userId}`} className="flex gap-4 mb-3">
            <img
              src={blog.author.personal_info.profile_img}
              className="w-[42px] h-[42px] rounded-full"
              alt="User Profile"
            />
          </Link>
          <div>
            <Link to={`/user/${blog.author.userId}`}>
              <p className="text-2xl">{blog.author.personal_info.username}</p>
            </Link>
            <p className="my-2 text-dark-grey line-clamp-2 max-w-[300px]">
              {blog.author.personal_info.bio}
            </p>

            {/* 关注按钮 */}
            {isFollowedByUser !== 2 ? (
              <button
                className="text-red bg-grey px-3 py-1 hover:text-white hover:bg-red my-4"
                onClick={() => handleFollow(isFollowedByUser)}
              >
                {isFollowedByUser === 1 ? (
                  <>
                    <i className="fi fi-br-check mr-1"></i>Followed
                  </>
                ) : (
                  <>Follow</>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContentBottomComponent;
