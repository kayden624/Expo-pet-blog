import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import newRequest from "../servers";
import { getGrowDay } from "../utils/formateDate";
import Loader from "../components/loader.component";
import { UserAuthContext } from "./../hooks/userAuthContext";

const UserInfo = () => {
  // 从路由参数中获取用户 ID
  const { id } = useParams();

  // 用于引用活动选项卡下方的线条元素
  const activeTabLineRef = useRef();
  // 用于引用默认激活的选项卡元素
  const activeTabRef = useRef();

  // 用于存储当前用户信息的状态
  const [currentUser, setCurrentUser] = useState(null);
  // 用于表示数据加载状态的状态
  const [loading, setLoading] = useState(true);

  // 从用户认证上下文获取当前用户的 ID
  const {
    userAuth: { userId },
  } = useContext(UserAuthContext);

  // 更改页面状态（主要是更新选项卡下方线条的样式）
  const changePageState = (btn) => {
    const { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
  };

  // 获取用户资料的函数
  const getProfile = useCallback(() => {
    newRequest
      .get(`/user/${id}/profile`)
      .then(({ data: { user } }) => {
        setCurrentUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, [id]);

  // 组件挂载时的副作用函数
  useEffect(() => {
    // 模拟点击默认激活的选项卡
    if (activeTabRef.current) {
      activeTabRef.current.click();
    }
    setLoading(true);
    // 更新页面状态
    if (activeTabRef.current) {
      changePageState(activeTabRef.current);
    }
    getProfile();
  }, [getProfile]);

  return (
    <div className="py-20">
      <div className="flex justify-center items-center w-[100%]">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-[30%]">
            <div className="flex justify-between items-center">
              <img
                src={currentUser.personal_info.profile_img}
                alt="testImg"
                className="w-[100px] h-[100px] rounded-full"
              />
              {userId === id ? (
                <Link
                  to="/setting/profile"
                  className="bg-grey w-12 h-12 rounded-md grid place-items-center"
                >
                  <i className="fi fi-rr-user-pen"></i>
                </Link>
              ) : (
                ""
              )}
            </div>
            <p className="my-6 text-2xl">
              {currentUser.personal_info.username}
            </p>

            <div className="flex gap-3 text-dark-grey">
              <p>{currentUser.activity.total_following} are following</p>
              <p>{currentUser.activity.total_verified_followers} followers</p>
            </div>

            <div className="flex gap-5 text-text-grey mb-10 text-xs">
              <div>
                <p>Badges Earned</p>
                <p>0</p>
              </div>
              <div>
                <p>Joined Blog Park</p>
                <p>{getGrowDay(currentUser.joinedAt)} days</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <span className="border border-grey block w-[100%]"></span>
      <div className="flex justify-center items-center w-[100%]">
        <div className="w-[30%]">
          <div className="flex flex-nowrap overflow-x-hidden py-3 relative mb-6">
            <NavLink
              to="updates"
              className="flex-1 flex items-center justify-center gap-2 text-xl "
              ref={null}
              onClick={(e) => {
                changePageState(e.target);
              }}
            >
              <i className="fi fi-rs-chart-line-up"></i> Updates
            </NavLink>
            <NavLink
              to="blogs"
              className="flex-1 flex items-center justify-center gap-2 text-xl "
              ref={activeTabRef}
              onClick={(e) => {
                changePageState(e.target);
              }}
            >
              <i className="fi fi-rr-edit"></i> Creations
            </NavLink>
            <NavLink
              to="favblogs"
              className="flex-1 flex items-center justify-center gap-2 text-xl "
              ref={null}
              onClick={(e) => {
                changePageState(e.target);
              }}
            >
              <i className="fi fi-rr-wishlist-star"></i> Favorites
            </NavLink>

            <hr
              ref={activeTabLineRef}
              className="absolute bottom-0 border-b border-red"
            />
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
