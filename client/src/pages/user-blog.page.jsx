import { useContext, useEffect, useState } from "react";
import BlogPostCard from "./../components/blog-post.component";
import newRequest from "../servers";
import NoDataMessage from "../components/noDataMessage.component";
import Loader from "../components/loader.component";
import LoadMoreBtn from "../components/loadMoreBtn.component";
import { useParams } from "react-router-dom";
import { UserAuthContext } from "../hooks/userAuthContext";

const UserBlogsPage = () => {
  // 从路由参数中获取用户ID
  const { id } = useParams();
  // 初始化博客列表状态
  const [blogList, setBlogList] = useState(null);
  // 从用户认证上下文获取当前用户ID
  const {
    userAuth: { userId },
  } = useContext(UserAuthContext);

  // 获取博客列表数据的函数
  const getblogList = (page = 1, limit = 10, isNew) => {
    newRequest
      .get("/blog/blogList", { params: { page, limit, userId: id } })
      .then(({ data }) => {
        if (blogList !== null && !isNew) {
          setBlogList({
            ...blogList,
            results: [...blogList.results, ...data.results],
            pageIndex: data.pageIndex,
          });
        } else {
          setBlogList({ ...data, pageIndex: 1 });
        }
      })
      .catch((res) => {
        console.error("Error fetching blog list:", res);
      });
  };

  // 组件挂载时获取博客列表数据
  useEffect(() => {
    getblogList(1, 2, true);
  }, []);

  return (
    <div>
      {blogList === null ? (
        <Loader />
      ) : blogList.results.length > 0 ? (
        blogList.results.map((b, i) => {
          const blogCon = b.blog;
          const authorCon = b.author;
          return (
            <BlogPostCard
              key={i}
              type="Create"
              profile_img={authorCon.profile_img}
              banner={blogCon.banner}
              title={blogCon.title}
              publish_time={blogCon.publishedAt}
              blogId={blogCon.blog_id}
              blog_id={blogCon._id}
              isOther={userId === id ? false : true}
              setBlogList={setBlogList}
            />
          );
        })
      ) : (
        <NoDataMessage message="No creations yet" />
      )}

      <LoadMoreBtn data={blogList} fetchDataFun={getblogList} />
    </div>
  );
};

export default UserBlogsPage;
