import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuthContext } from "../hooks/userAuthContext";
import { removeFromSession } from "../servers/sessions";

const UserNavigationPanel = () => {
  // 从用户认证上下文获取设置用户认证状态的函数和用户ID
  const {
    setUserAuth,
    userAuth: { userId },
  } = useContext(UserAuthContext);
  // 获取导航函数
  const navigate = useNavigate();

  // 处理退出登录操作
  const handleExit = () => {
    // 从会话中移除用户信息
    removeFromSession("user");
    // 将用户认证状态的访问令牌置为 null
    setUserAuth({ access_token: null });
    // 导航到首页
    navigate("/");
  };

  return (
    <div className="absolute right-[-400%] bg-white border border-grey w-60 overflow-hidden">
      {/* 导航到用户个人主页 */}
      <Link
        to={`/user/${userId}/blogs`}
        className="link pl-8 py-4 flex gap-5 items-center"
      >
        <i className="fi fi-ss-picpeople-filled text-black"></i>
        <p className="text-sm">Personal Homepage</p>
      </Link>
      {/* 导航到帐号设置页面 */}
      <Link
        to="/setting/profile"
        className="link pl-8 py-4 flex gap-5 items-center"
      >
        <i className="fi fi-ss-settings text-black"></i>
        <p className="text-sm">Account Settings</p>
      </Link>

      {/* 分割线 */}
      <span className="absolute border-t border-grey w-[100%]"></span>

      {/* 退出登录按钮 */}
      <button
        className="text-black py-3 w-full hover:bg-grey"
        onClick={handleExit}
      >
        <p>Log Out</p>
      </button>
    </div>
  );
};

export default UserNavigationPanel;
