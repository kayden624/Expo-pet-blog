import { Link } from "react-router-dom";
import { getFullDay } from "../utils/formateDate";

const NotificationFollowUser = ({ followedUser, user, publish_time }) => {
  return (
    <div className="flex my-3">
      {/* 关注者的头像 */}
      <img
        src={user.personal_info.profile_img}
        className="w-[40px] h-[40px] rounded-full"
        alt="Follower's Profile"
      />
      <div className="px-3 w-[80%] min-w-[350px]">
        {/* 提示信息 */}
        <p className="text-dark-grey mb-3">Followed a user</p>
        <Link
          target="_parent"
          to={`/user/${followedUser.userId}/blogs`}
          className="bg-grey flex flex-col p-4 rounded-lg w-[60%]"
        >
          {/* 被关注者的头像 */}
          <img
            src={followedUser.personal_info.profile_img}
            className="w-[48px] h-[48px] object-cover rounded-full"
            alt="Followed User's Profile"
          />
          {/* 被关注者的用户名 */}
          <p className="my-3">{followedUser.personal_info.username}</p>
          {/* 被关注者的个人简介 */}
          <p className="line-clamp-2">{followedUser.personal_info.bio}</p>
          <div className="flex gap-4">
            <p>{followedUser.activity.total_following} people are following</p>
            <p>{followedUser.activity.total_posts} articles</p>
          </div>
        </Link>
      </div>
      {/* 关注事件的发布时间 */}
      <span className="text-dark-grey text-sm">{getFullDay(publish_time)}</span>
    </div>
  );
};

export default NotificationFollowUser;
