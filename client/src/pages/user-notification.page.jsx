import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../servers";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/noDataMessage.component";
import BlogPostCard from "../components/blog-post.component";
import NotificationFollowUser from "../components/notification-followUser.component";
import NotificationComment from "../components/notification-comment.component";

const UserNotificationPage = () => {
  // 从路由参数中获取用户 ID
  const { id } = useParams();
  // 初始化通知列表状态
  const [notifications, setNotifications] = useState(null);

  // 组件挂载时获取通知列表数据
  useEffect(() => {
    newRequest
      .get(`/notification/list/${id}`)
      .then(({ data }) => {
        // console.log(data);
        setNotifications(data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, [id]);

  return (
    <>
      {notifications === null ? (
        <Loader />
      ) : notifications.results.length === 0 ? (
        <NoDataMessage message="No updates yet" />
      ) : (
        notifications.results.map((item, i) => {
          const blog = item.blog;
          const user = item.user;
          if (item.type === "createBlog") {
            return (
              <BlogPostCard
                key={i}
                type="Create"
                profile_img={user.personal_info.profile_img}
                banner={blog.banner}
                title={blog.title}
                publish_time={item.createdAt}
                blog_id={blog.blog_id}
                isOther={true}
              />
            );
          } else if (item.type === "likeBlog") {
            return (
              <BlogPostCard
                key={i}
                type="Like"
                profile_img={user.personal_info.profile_img}
                banner={blog.banner}
                title={blog.title}
                publish_time={item.createdAt}
                blog_id={blog.blog_id}
                isOther={true}
              />
            );
          } else if (item.type === "followUser") {
            return (
              <NotificationFollowUser
                key={i}
                followedUser={item.followedUser}
                user={item.user}
                publish_time={item.createdAt}
              />
            );
          } else if (item.type === "comment" || item.type === "reply") {
            return (
              <NotificationComment
                key={i}
                user={user}
                comment={item.comment}
                blog={blog}
                publish_time={item.createdAt}
              />
            );
          } else {
            return <h2 key={i}>Unrecognized</h2>;
          }
        })
      )}
    </>
  );
};

export default UserNotificationPage;
