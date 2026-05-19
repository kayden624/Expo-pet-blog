import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";

const Sidebar = () => {
  // 从用户认证上下文获取访问令牌
  const {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  // 如果未登录，导航到登录页面
  if (access_token === null) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="bg-gray-200">
      <div className="py-20 w-[50%] mx-auto">
        {/* 顶部标题 */}
        <div className="flex items-center gap-4 mt-3">
          <i className="fi fi-tr-customize text-3xl"></i>
          <span className="text-3xl">Account Settings</span>
        </div>
        {/* 内容区域 */}
        <div className="flex gap-5 py-4">
          {/* 左侧侧边栏导航 */}
          <div className="flex flex-col min-w-[120px] overflow-y-auto">
            <NavLink to="/setting/profile" className="sidebar-link">
              Profile
            </NavLink>
            <NavLink to="/setting/account" className="sidebar-link">
              Account Info
            </NavLink>
            <NavLink to="/setting/password" className="sidebar-link">
              Password
            </NavLink>
          </div>
          {/* 渲染子路由内容 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
