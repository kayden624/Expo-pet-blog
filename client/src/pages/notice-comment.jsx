import { useCallback, useContext, useEffect, useState } from "react";
import newRequest from "../servers";
import { UserAuthContext } from "../hooks/userAuthContext";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/noDataMessage.component";
import LoadMoreBtn from "../components/loadMoreBtn.component";
import { getFormatedBlogPublishedTime } from "../utils/formateDate";
import { Link } from "react-router-dom";

const NoticeCommentPage = () => {
  // 从 UserAuthContext 中获取 access_token
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 初始化评论列表状态
  const [commentList, setCommentList] = useState(null);

  // 定义获取数据的函数
  const fetchData = useCallback((page = 1, limit = 2, isNew) => {
    // 检查 access_token 是否存在
    if (!access_token) {
      console.error("Access token is not available yet.");
      return;
    }

    // 发起请求
    newRequest
      .get(`/notification/notice-comment/${page}/${limit}/comment`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(({ data }) => {
        setCommentList((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : data);
      })
      .catch((error) => {
        // 捕获请求错误并打印日志
        console.error("Error fetching data:", error);
        // 可以在这里添加更友好的用户提示，比如使用 toast 库
      });
  }, [access_token]);

  // 使用 useEffect 监听 access_token 的变化
  useEffect(() => {
    if (access_token) {
      // 当 access_token 有值时，发起首次请求
      fetchData(1, 2, true);
    }
  }, [access_token, fetchData]);

  return (
    <div className="mt-2">
      {commentList === null ? (
        // 数据加载中，显示加载器
        <Loader />
      ) : commentList.results.length === 0 ? (
        // 没有数据，显示无数据提示
        <NoDataMessage message="No data available" />
      ) : (
        // 渲染评论列表
        commentList.results.map((item, i) => {
          return (
            <div
              key={i}
              className="bg-white px-3 py-6 flex gap-2 border-b border-grey"
            >
              <img
                src={item.user.personal_info.profile_img}
                className="w-[38px] h-[38px] rounded-full"
                alt="User Profile"
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p>
                    <span className="text-xl mr-2">
                      {item.user.personal_info.username}
                    </span>
                    Replied to my article
                  </p>
                  <p>{getFormatedBlogPublishedTime(item.createdAt)}</p>
                </div>

                <p className="my-2">{item.comment.comment}</p>
                <Link
                  to={`/blog/${item.blog.blog_id}`}
                  className="bg-grey rounded-full px-3 py-2"
                >
                  {item.blog.title}
                </Link>
              </div>
            </div>
          );
        })
      )}

      <LoadMoreBtn data={commentList} fetchDataFun={fetchData} />
    </div>
  );
};

export default NoticeCommentPage;
