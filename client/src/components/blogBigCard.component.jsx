import { Link } from "react-router-dom";
import { getMonthDay } from "../utils/formateDate";
import defaultImg from "../imgs/defaultImg.jpg";

const BlogBigCard = ({ blog, author }) => {
  const authorProfile = author?.personal_info ?? {};

  return (
    <>
      <Link className="flex my-4" to={`/blog/${blog.blog_id}`}>
        <img src={blog.banner} className="w-[400px] h-[200px] " />
        <div className=" max-w-[400px] w-[100%] p-8 flex flex-col justify-between bg-white ">
          <span className="font-bold text-2xl line-clamp-2 mb-4">
            {blog.title}
          </span>
          <div className="flex justify-between ">
            <div className="flex gap-2">
              <img
                src={authorProfile.profile_img || defaultImg}
                alt="author profile"
                className="w-[24px] h-[24px] rounded-full object-cover"
              />
              <span>{authorProfile.username || "Unknown author"}</span>
              <span>{getMonthDay(blog.publishedAt)}</span>
            </div>

            <div className="flex gap-8">
              <span>
                <i className="fi fi-rr-bolt mr-1"></i>
                {blog.activity.total_likes}
              </span>
              <span>
                <i className="fi fi-rr-comment-alt"> </i>
                {blog.activity.total_comments}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default BlogBigCard;
