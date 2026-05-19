import { useContext, useState } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";
import { toast, Toaster } from "react-hot-toast";
import newRequest from "../servers";
import { BlogPageContext } from "../pages/blog.page";
import { Navigate } from "react-router-dom";
import { CommentContext } from "./comment.component";

const CommentField = ({ rootData = null, to = null, setShow }) => {
  // 从用户认证上下文获取用户认证信息和相关数据
  const {
    userAuth: { access_token, profile_img, username, _id },
  } = useContext(UserAuthContext);

  // 从博客页面上下文获取博客信息和设置博客信息的函数
  const { blog, setBlog } = useContext(BlogPageContext);

  // 评论输入框的文本内容状态
  const [textValue, setTextValue] = useState(null);

  // 从评论上下文获取评论列表和设置评论列表的函数
  const { commentList, setCommentList } = useContext(CommentContext);

  // 提交新评论的函数
  const handleNewComment = () => {
    if (!textValue || textValue.trim().length === 0) {
      return toast.error("You cannot submit empty content!");
    }

    newRequest
      .post(
        "/comment/create",
        {
          blog_id: blog._id,
          comment: textValue,
          from: _id,
          to: to ? to._id : null,
          root: rootData,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data: { comment_id } }) => {
        setShow((preVal) => !preVal);

        setBlog((prevBlog) => ({
          ...prevBlog,
          activity: {
            ...prevBlog.activity,
            total_comments: prevBlog.activity.total_comments + 1,
          },
        }));

        newRequest
          .get(`/comment/${rootData === null ? comment_id : rootData}`)
          .then(({ data }) => {
            if (rootData === null) {
              // 添加新评论
              setCommentList({
                ...commentList,
                results: [data, ...commentList.results],
                pageIndex: data.pageIndex,
              });
              // 添加评论通知
              newRequest
                .post(
                  "/notification",
                  {
                    type: "comment",
                    user: _id,
                    blog: blog._id,
                    comment: comment_id,
                    notification_for: blog.author._id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${access_token}`,
                    },
                  }
                )
                .then(() => {
                  toast.success("Comment submitted successfully");
                });
            } else {
              // 更新评论（回复情况）
              const newComment = commentList.results.map((item) => {
                if (item._id === rootData) {
                  return data;
                } else {
                  return item;
                }
              });

              setCommentList({
                ...commentList,
                results: newComment,
              });

              // 更新评论通知（回复情况）
              newRequest.post(
                "/notification",
                {
                  type: "reply",
                  user: _id,
                  blog: blog._id,
                  comment: comment_id,
                  replied_on_comment: rootData,
                  notification_for: blog.author._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              );
            }
          });
      })
      .catch((err) => {
        console.error("Error submitting comment:", err);
      });
  };

  // 处理评论输入框内容变化的函数
  const handleCommentChange = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setTextValue(e.target.value);
  };

  return access_token === null ? (
    <Navigate to="/signin" />
  ) : (
    <>
      <Toaster />

      <div className="bg-grey my-2 p-4 flex">
        <img
          src={profile_img}
          alt="user_img"
          className="w-[40px] h-[40px] rounded-full object-cover mr-2"
        />

        <div className="w-full">
          <span className="flex">
            {username}
            {to ? (
              <p className="text-dark-grey">
                &nbsp; Replied to &nbsp; {to.username}
              </p>
            ) : null}
          </span>
          <textarea
            defaultValue={textValue}
            placeholder="Please enter your comment"
            className="w-full min-h-[77px] resize-none outline-none leading-tight my-3 p-4"
            onChange={handleCommentChange}
            autoFocus
          ></textarea>
          <button
            className="py-2 px-4 rounded-md bg-white"
            onClick={handleNewComment}
          >
            Comment
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentField;
