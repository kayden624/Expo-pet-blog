import { Link } from "react-router-dom";
import { getFullDay } from "./../utils/formateDate";
import { getAuthorView } from "../utils/author";

const SearchBlogCardTitle = ({ title }) => {
  return (
    <div>
      <p className="text-xl" dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  );
};

const SearchBlogCardSummer = ({ title }) => {
  return (
    <div>
      <p
        className="line-clamp-2 text-dark-grey text-sm"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
};

const SearchBlogCard = ({ title, summer, blog }) => {
  const author = getAuthorView(blog.author);
  return (
    <Link
      to={`/blog/${blog.blog_id}`}
      className="flex justify-between bg-white w-[70%] p-6 my-2"
    >
      <div className="flex flex-col gap-4 max-w-[420px] flex-1">
        {/* <p className="text-xl">{title}</p> */}
        <SearchBlogCardTitle title={title} />
        {/* <p className="line-clamp-2 text-dark-grey text-sm max-w-[420px]">
          {summer}
        </p> */}
        <SearchBlogCardSummer title={summer} />
        <div className="flex gap-3 text-dark-grey text-sm line-clamp-2">
          {blog.tags.map((item, i) => {
            return <p key={i}>#{item}</p>;
          })}
        </div>
        <div className="flex gap-7">
          <div className="flex gap-2">
            <img
              src={author.profileImage}
              alt="user"
              className="w-[20px] h-[20px] rounded-full"
            />
            <span>{author.username}</span>
          </div>
          <p>{getFullDay(blog.publishedAt)}</p>
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
      <img
        src={blog.banner}
        alt="banner"
        className="w-[284px] h-[142px] object-cover"
      />
    </Link>
  );
};

export default SearchBlogCard;
