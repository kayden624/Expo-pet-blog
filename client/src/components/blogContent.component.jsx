import { useContext } from "react";
import { getFormatedBlogPublishedTime } from "../utils/formateDate";
import Loader from "./loader.component";
import BlogBlockContent from "../utils/blogBlockContent";
import { BlogPageContext } from "../contexts/blogPageContext";

const BlogContentComponent = () => {
  let {
    blog,
    blog: { content },
  } = useContext(BlogPageContext);

  return Object.keys(blog).length === 0 || content.length === 0 ? (
    <Loader />
  ) : (
    <>
      <img
        src={blog.banner}
        alt="banner"
        className="w-[754px] h-[354px] absolute top-[80px] left-[50%] translate-x-[-50%] "
      />
      <div className="bg-white w-[100%] pt-3">
        <div className=" mx-auto max-w-[664px] pt-[160px]">
          <span className="text-3xl">{blog.title}</span>
          <div className="flex justify-between my-5">
            <div className="flex gap-2 items-center">
              <img
                src={blog.author.personal_info.profile_img}
                alt="profile_img"
                className="w-[36px] h-[36px] rounded-full"
              />
              <p>{blog.author.personal_info.username}</p>
            </div>

            <p>{getFormatedBlogPublishedTime(blog.publishedAt)}</p>
          </div>

          {content[0].blocks.map((block, i) => {
            return (
              <div key={i} className="my-4 md:my-8">
                <BlogBlockContent block={block} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BlogContentComponent;
