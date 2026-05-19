import { Link } from "react-router-dom";

const BlogFollowCard = ({ title, banner, blog_id }) => {
  return (
    <Link to={`/blog/${blog_id}`}>
      <div className="flex bg-grey justify-between items-center p-3 my-3 rounded-md">
        <p className="line-clamp-2">{title}</p>
        <img
          src={banner}
          alt="banner"
          className="aspect-video rounded-md max-w-[120px]"
        />
      </div>
    </Link>
  );
};

export default BlogFollowCard;
