import { Link } from "react-router-dom";
import { getFullDay } from "../utils/formateDate";

const NotificationComment = ({ user, comment, blog, publish_time }) => {
  return (
    <div className="flex my-3">
      {/* 用户头像 */}
      <img
        src={user.personal_info.profile_img}
        className="w-[40px] h-[40px] rounded-full"
        alt="User Profile"
      />
      <div className="px-3 w-[80%] min-w-[350px]">
        {/* 提示信息 */}
        <p className="text-dark-grey mb-3">Posted a comment</p>
        <Link to={`/blog/${blog.blog_id}`}>
          <i className="fi fi-ss-comment-quote"></i>
          {/* 评论内容 */}
          <p className="mb-3">{comment.comment}</p>
          <div className="flex items-center justify-between bg-grey p-3 rounded-md ">
            {/* 博客标题 */}
            <p className="line-clamp-2 min-w-[60px]">{blog.title}</p>
            {/* 博客封面图 */}
            <img
              src={blog.banner}
              className="aspect-video rounded-md max-w-[120px]"
              alt="Blog Banner"
            />
          </div>
        </Link>
      </div>
      {/* 评论发布时间 */}
      <span className="text-dark-grey text-sm">{getFullDay(publish_time)}</span>
    </div>
  );
};

export default NotificationComment;
