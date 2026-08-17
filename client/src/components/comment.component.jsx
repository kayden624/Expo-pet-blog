import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";
import { CommentContext } from "./commentContext";
import CommentField from "./commentField.component";
import newRequest from "../servers";
import { BlogPageContext } from "../contexts/blogPageContext";
import CommentCard from "./commentCard.component";
import Loader from "./loader.component";
import NoDataMessage from "./noDataMessage.component";
import LoadMoreBtn from "./loadMoreBtn.component";

const CommentBlock = () => {
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 从博客页面上下文获取博客的总评论数
  const {
    blog: {
      activity: { total_comments },
    },
  } = useContext(BlogPageContext);

  // 评论列表状态
  const [commentList, setCommentList] = useState(null);

  // 获取URL参数中的博客ID
  const { blog_id } = useParams();

  // 控制评论输入框显示状态
  const [isShow, setShow] = useState(false);
  const wrapperRef = useRef(null);

  // 处理评论输入框显示切换
  const handleInput = () => {
    setShow((preVal) => !preVal);
  };

  // 根据博客ID获取评论列表
  const getCommentListByBlog = useCallback((page = 1, limit = 2, isNew) => {
    newRequest
      .get(`/comment/commentList/${blog_id}/${page}/${limit}`)
      .then(({ data }) => {
        setCommentList((current) =>
          current !== null && !isNew
            ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
            : { ...data }
        );
      })
      .catch((err) => {
        console.error("Error fetching comment list:", err);
      });
  }, [blog_id]);

  // 组件挂载时获取评论列表，并添加点击外部隐藏输入框的监听
  useEffect(() => {
    // 获取评论列表
    getCommentListByBlog(1, 2, true);

    // 点击外部隐藏输入框
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [getCommentListByBlog]);

  return (
    <CommentContext.Provider value={{ commentList, setCommentList }}>
      <div className="w-full">
        <div className="max-w-[644px] mx-auto my-4" ref={wrapperRef}>
          {access_token === null ? (
            <div className="bg-grey my-2 p-4">
              <p>
                Please{" "}
                <Link to="/signin" className="underline">
                  log in
                </Link>{" "}
                to leave a comment...
              </p>
            </div>
          ) : (
            <>
              <p className="text-center">All Comments ({total_comments})</p>

              {!isShow ? (
                <p onClick={handleInput} className="bg-grey my-2 p-4">
                  Writing respectful, rational, and friendly comments helps for
                  better communication.
                </p>
              ) : (
                <CommentField setShow={setShow} />
              )}
            </>
          )}

          {commentList === null ? (
            <Loader />
          ) : commentList.results.length === 0 ? (
            <NoDataMessage message="No comments yet" />
          ) : (
            commentList.results.map((comment, i) => {
              return <CommentCard key={i} commentData={comment} />;
            })
          )}

          <LoadMoreBtn data={commentList} fetchDataFun={getCommentListByBlog} />
        </div>
      </div>
    </CommentContext.Provider>
  );
};

export default CommentBlock;
