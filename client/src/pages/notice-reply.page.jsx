import { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../components/loader.component";
import newRequest from "../servers";
import { UserAuthContext } from "../hooks/userAuthContext";
import { Link } from "react-router-dom";
import LoadMoreBtn from "../components/loadMoreBtn.component";
import { getFormatedBlogPublishedTime } from "../utils/formateDate";
import NoDataMessage from "../components/noDataMessage.component";

const NoticeReplyPage = () => {
  // 从用户认证上下文获取访问令牌
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 初始化评论列表状态
  const [commentList, setCommentList] = useState(null);

  // 获取数据的函数
  const fetchData = useCallback((page = 1, limit = 2, isNew) => {
    if (!access_token) {
      console.error("Access token is not available yet.");
      return;
    }

    newRequest
      .get(`/notification/notice-comment/${page}/${limit}/reply`, {
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
        console.error("Error fetching data:", error);
        setCommentList({ results: [], totalDocs: 0, pageIndex: page });
      });
  }, [access_token]);

  // 当访问令牌变化时，获取数据
  useEffect(() => {
    if (access_token) {
      fetchData(1, 2, true);
    }
  }, [access_token, fetchData]);

  return (
    <div className="mt-2">
      {commentList === null ? (
        <Loader />
      ) : commentList.results.length === 0 ? (
        <NoDataMessage message="No data available" />
      ) : (
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
                    Replied to my comment
                  </p>
                  <p>{getFormatedBlogPublishedTime(item.createdAt)}</p>
                </div>

                <p className="my-2">{item.comment.comment}</p>
                <Link
                  to={`/blog/${item.blog.blog_id}`}
                  className="bg-grey rounded-full px-3 py-2"
                >
                  <i className="fi fi-ss-comment-quote"></i>
                  {item.replied_on_comment.comment}
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

export default NoticeReplyPage;
