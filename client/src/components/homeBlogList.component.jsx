import { useCallback, useContext, useEffect, useState } from "react";
import newRequest from "../servers";
import { UserAuthContext } from "../hooks/userAuthContext";
import InPageNavigation from "./inpage-navigation.component";
import Loader from "./loader.component";
import BlogBigCard from "./blogBigCard.component";
import LoadMoreBtn from "./loadMoreBtn.component";
import NoDataMessage from "./noDataMessage.component";

// 定义导航路由
const routes = [
  { id: "home", name: "Recommended" },
  { id: "follow", name: "Followed" },
];

const HomeBlogList = () => {
  // 从用户认证上下文获取访问令牌
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 热门博客数据状态
  const [hotBlogs, sethotBlogs] = useState(null);
  // 关注的博客数据状态
  const [followedBlogs, setFollowedBlogs] = useState(null);

  // 当前页面状态
  const [pageState, setPageState] = useState("home");

  // 获取热门博客列表
  const getHotBlogs = useCallback((page = 1, limit = 2, isNew) => {
    newRequest
      .get("/blog/getHotBlogs", { params: { page, limit } })
      .then(({ data }) => {
        sethotBlogs((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : { ...data });
      })
      .catch((error) => {
        console.error("Error fetching hot blogs:", error);
      });
  }, []);

  // 获取关注的博客列表
  const getFollowedBlogs = useCallback((page = 1, limit = 2, isNew) => {
    if (!access_token) {
      return;
    }
    newRequest
      .get("/blog/blogList/followd_user", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => {
        setFollowedBlogs((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : { ...data });
      })
      .catch((error) => {
        console.error("Error fetching followed blogs:", error);
      });
  }, [access_token]);

  // 页面状态改变时重新获取数据
  useEffect(() => {
    sethotBlogs(null);
    setFollowedBlogs(null);

    if (pageState === "home") {
      getHotBlogs(1, 2, true);
    }

    if (pageState === "follow") {
      getFollowedBlogs(1, 2, true);
    }
  }, [pageState, getFollowedBlogs, getHotBlogs]);

  return (
    <InPageNavigation
      routes={routes}
      defaultHidden={access_token === null ? ["follow"] : []}
      setPageState={setPageState}
    >
      {/* 显示热门博客 */}
      {pageState === "home" && (
        <>
          {hotBlogs === null ? (
            <Loader />
          ) : hotBlogs.results.length === 0 ? (
            <NoDataMessage message="No data available" />
          ) : (
            hotBlogs.results.map((b, i) => {
              return <BlogBigCard key={i} blog={b} author={b.author} />;
            })
          )}
          <LoadMoreBtn data={hotBlogs} fetchDataFun={getHotBlogs} />
        </>
      )}
      {/* 显示关注的博客 */}
      {pageState === "follow" && (
        <>
          {followedBlogs === null ? (
            <NoDataMessage message="No data available" />
          ) : followedBlogs.results?.length === 0 ? (
            <NoDataMessage message="No data available" />
          ) : followedBlogs.results ? (
            followedBlogs.results.map((b, i) => {
              return <BlogBigCard key={i} blog={b} author={b.author} />;
            })
          ) : (
            <Loader /> // 如果 followedBlogs 存在但没有 results 属性，继续显示加载器
          )}
          <LoadMoreBtn data={followedBlogs} fetchDataFun={getFollowedBlogs} />
        </>
      )}
    </InPageNavigation>
  );
};

export default HomeBlogList;
