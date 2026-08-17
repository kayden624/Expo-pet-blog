import { useCallback, useEffect, useState } from "react";
import newRequest from "../servers";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/noDataMessage.component";
import { useParams } from "react-router-dom";
import BlogFollowCard from "./../components/blogFollowedCard";
import LoadMoreBtn from "./../components/loadMoreBtn.component";

const UserFavBlogsPage = () => {
  // 从路由参数中获取用户 ID
  const { id } = useParams();
  // 初始化关注的博客列表状态
  const [followedBlogs, setFollowedBlogs] = useState(null);

  // 获取关注的博客列表数据
  const getFollowedBlogs = useCallback((page = 1, limit = 2, isNew) => {
    newRequest
      .get("/blog/blogList/followed", {
        params: { page, limit, userId: id },
      })
      .then(({ data }) => {
        setFollowedBlogs((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : { ...data });
      })
      .catch((err) => {
        console.error("Error fetching followed blogs:", err);
      });
  }, [id]);

  // 组件挂载时获取关注的博客列表数据
  useEffect(() => {
    getFollowedBlogs(1, 2, true);
  }, [getFollowedBlogs]);

  return (
    <div>
      {followedBlogs === null ? (
        <Loader />
      ) : followedBlogs.results && followedBlogs.results.length === 0 ? (
        <NoDataMessage message="No data available" />
      ) : followedBlogs.results ? (
        followedBlogs.results.map((blog, i) => {
          return (
            <BlogFollowCard
              key={i}
              title={blog.title}
              banner={blog.banner}
              blog_id={blog.blog_id}
            />
          );
        })
      ) : null}

      <LoadMoreBtn data={followedBlogs} fetchDataFun={getFollowedBlogs} />
    </div>
  );
};

export default UserFavBlogsPage;
