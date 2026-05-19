import { Link } from "react-router-dom";
import { getFullDay } from "../utils/formateDate";
import newRequest from "../servers";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";

const BlogPostCard = ({
  type,
  profile_img,
  title,
  banner,
  publish_time,
  blog_id,
  blogId,
  isOther,
  setBlogList,
}) => {
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 处理删除博客的函数
  const handleDeleteBlog = (blog_id) => {
    newRequest
      .delete(`/blog/${blog_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        toast.success("Blog post deleted successfully!");
        // 更新博客列表，过滤掉已删除的博客
        setBlogList((preVal) => ({
          ...preVal,
          results: {
            ...preVal.results.filter((item) => item._id !== blog_id),
          },
        }));
      });
  };

  return (
    <div className="flex my-3">
      {/* 显示用户头像 */}
      <img
        src={profile_img}
        className="w-[40px] h-[40px] rounded-full"
        alt="User Profile"
      />

      <div className="px-3 w-[80%] min-w-[350px]">
        <p className="text-dark-grey mb-3">{`${type} posted an article`}</p>
        <Link to={`/blog/${blogId}`}>
          <div className="flex items-center justify-between bg-grey p-3 rounded-md ">
            <p className="line-clamp-2 min-w-[60px]">{title}</p>
            <img
              src={banner}
              className="aspect-video rounded-md max-w-[120px]"
              alt="Blog Banner"
            />
          </div>
        </Link>
      </div>

      <div>
        {/* 显示发布时间 */}
        <span className="text-dark-grey text-sm">
          {getFullDay(publish_time)}
        </span>

        {!isOther ? (
          <div className="flex gap-1">
            {/* 删除按钮，添加提示信息 */}
            <button
              className="bg-grey w-[30px] h-[30px] rounded-full"
              onClick={() => handleDeleteBlog(blog_id)}
              title="Delete this blog post"
            >
              <i className="fi fi-rr-trash text-red"></i>
            </button>
            <Link
              to={`/blog/write/${blogId}`}
              className="bg-grey w-[30px] h-[30px] rounded-full inline-flex items-center justify-center"
              title="Edit this blog post"
            >
              <i className="fi fi-rr-edit"></i>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPostCard;
