import { useContext, useState } from "react";
import { getFormatedBlogPublishedTime } from "../utils/formateDate";
import CommentField from "./commentField.component";
import { UserAuthContext } from "../hooks/userAuthContext";
import newRequest from "../servers";
import toast from "react-hot-toast";
import { BlogPageContext } from "../pages/blog.page";
import { CommentContext } from "./comment.component";

const CommentCard = ({ commentData }) => {
  // commentData is rootData
  const { _id, comment, from, commentedAt, replies, count } = commentData;

  const {
    userAuth,
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 从评论上下文获取评论列表和设置评论列表的函数
  const { commentList, setCommentList } = useContext(CommentContext);

  // 从博客页面上下文获取博客信息和设置博客信息的函数
  const { blog, setBlog } = useContext(BlogPageContext);

  // 回复的目标用户状态
  const [toUser, setToUser] = useState(null);

  // 评论输入框显示状态
  const [isShow, setShow] = useState(false);

  // 处理回复评论的函数
  const handleReComment = (data = null) => {
    setShow((preVal) => !preVal);

    if (data) {
      setToUser({
        _id: data.from._id,
        username: data.from.personal_info.username,
      });
    }
  };

  // 处理删除评论的函数
  const handleDeleteComment = (comment_id, type, root = null) => {
    if (!access_token) {
      return toast.error("Please log in first!");
    }
    newRequest
      .delete(`/comment/${comment_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data: { delCount } }) => {
        toast.success("Comment deleted successfully!");
        setBlog((prevBlog) => ({
          ...prevBlog,
          activity: {
            ...prevBlog.activity,
            total_comments: prevBlog.activity.total_comments - delCount,
          },
        }));

        // 创建通知
        const delObj = {
          type: type,
          user: userAuth._id,
          blog: blog._id,
          comment: comment_id,
          replied_on_comment: root,
        };

        newRequest
          .post("/notification", {
            data: delObj,
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(() => {
            if (root == null) {
              setCommentList({
                ...commentList,
                results: commentList.results.filter(
                  (item) => item._id !== comment_id
                ),
              });
            } else {
              setCommentList({
                ...commentList,
                results: commentList.results.map((com) => {
                  if (com._id == root) {
                    return {
                      ...com,
                      replies: com.replies.filter(
                        (item) => item._id !== comment_id
                      ),
                    };
                  } else {
                    return com;
                  }
                }),
              });
            }
          });
      });
  };

  return (
    <div className="bg-grey p-4 flex flex-col my-5">
      <div className="my-2 flex gap-3">
        <img
          src={from.personal_info.profile_img}
          alt="user_img"
          className="w-[40px] h-[40px] rounded-full"
        />
        <div>
          <p>{from.personal_info.username}</p>
          <p className="text-dark-grey text-sm">
            {getFormatedBlogPublishedTime(commentedAt)}
          </p>
          <p className="my-3 line-clamp-2">{comment}</p>
          <div>
            <button className="mr-4">
              <i className="fi fi-rr-heart pr-1"></i>0
            </button>
            <button onClick={() => handleReComment()} className="mr-4">
              <i className="fi fi-rr-comment-alt"> </i>
              {count}
            </button>
            {userAuth._id === from._id ? (
              <button onClick={() => handleDeleteComment(_id, "comment")}>
                <i className="fi fi-rr-trash"></i>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 如果有子评论 */}
      {replies.map((item, i) => {
        return (
          <div className="my-2 flex gap-3 pl-8" key={i}>
            <img
              src={item.from.personal_info.profile_img}
              alt="user_img"
              className="w-[40px] h-[40px] rounded-full"
            />
            <div>
              <span className="flex">
                {item.from.personal_info.username}
                {item.to !== null ? (
                  <p className="text-dark-grey">
                    &nbsp; Replied to &nbsp; {item.to.personal_info.username}
                  </p>
                ) : null}
              </span>
              <p className="text-dark-grey text-sm">
                {getFormatedBlogPublishedTime(item.commentedAt)}
              </p>
              <p className="my-3 line-clamp-2">{item.comment}</p>
              <div>
                <button className="mr-4">
                  <i className="fi fi-rr-heart pr-1"></i>0
                </button>
                <button onClick={() => handleReComment(item)} className="mr-4">
                  <i className="fi fi-rr-comment-alt"> </i>
                  {item.count}
                </button>
                {userAuth._id === item.from._id ? (
                  <button
                    onClick={() =>
                      handleDeleteComment(item._id, "reply", item.root)
                    }
                  >
                    <i className="fi fi-rr-trash"></i>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}

      {/* {replies.length < count? (
        <button onClick={handleShowAll}>共21条回复，点击查看</button>
      ) : (
        ""
      )} */}

      {/* 如果有子评论结束 */}

      {!isShow ? null : (
        <CommentField
          rootData={_id}
          to={!toUser ? null : toUser}
          setShow={setShow}
        />
      )}
    </div>
  );
};

export default CommentCard;
