import BlogContentComponent from "../components/blogContent.component";
import BlogContentBottomComponent from "../components/blogContentbottom.component";
import CommentBlock from "../components/comment.component";
import { createContext, useEffect, useState } from "react";
import newRequest from "../servers";
import { useParams } from "react-router-dom";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  author: { personal_info: {}, verified_followers: [], following: [] },
  publishedAt: "",
  activity: { total_likes: "", total_reads: "" },
  liked_users: [],
  followed_users: [],
};

export const BlogPageContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [isFollowedByUser, setFollowedByUser] = useState(null);
  const [isLikedByUser, setLikeddByUser] = useState(null);
  const [isFollowedByBlog, setFollowedByBlog] = useState(null);

  const getBlogContent = () => {
    newRequest
      .get(`/blog/${blog_id}/view`)
      .then(({ data: { blog } }) => {
        setBlog(blog);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBlogContent();
  }, [blog_id]);

  return (
    <>
      <BlogPageContext.Provider
        value={{
          blog,
          setBlog,
          isFollowedByUser,
          setFollowedByUser,
          isLikedByUser,
          setLikeddByUser,
          isFollowedByBlog,
          setFollowedByBlog,
        }}
      >
        <div className="bg-grey relative w-[100%] h-[280px]"></div>
        <BlogContentComponent />

        <BlogContentBottomComponent />

        <CommentBlock />
      </BlogPageContext.Provider>
    </>
  );
};

export default BlogPage;
