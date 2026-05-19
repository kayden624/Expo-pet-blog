import { Link } from "react-router-dom";
import logoImg from "/public/logo.svg";
import { useContext, useState } from "react";
import UserNavigationPanel from "./user-navigation.component";
import { UserAuthContext } from "../hooks/userAuthContext";
import UserAuthForm from "./userAuthForm.component";
import SearchModal from "./searchModal.component";

const Navbar = () => {
  // 用户导航面板显示状态
  const [userNavPanel, setUserNavPanel] = useState(false);
  // 从用户认证上下文获取访问令牌和用户头像
  const {
    userAuth: { access_token, profile_img },
  } = useContext(UserAuthContext);

  // 登录模态框显示状态
  const [modalpannel, setModalPannel] = useState(false);
  // 搜索模态框显示状态
  const [searchModal, setSearchModal] = useState(false);

  // 处理用户导航面板显示切换
  const handleUserNavPanel = () => {
    setUserNavPanel((preVal) => !preVal);
  };

  // 处理用户导航面板失去焦点事件
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  // 处理登录模态框显示切换
  const handleModal = () => {
    setModalPannel((preVal) => !preVal);
  };

  // 处理搜索按钮点击事件
  const handleSearchbtnClick = () => {
    setSearchModal((preVal) => !preVal);
  };

  return (
    <>
      <nav className="z-50 top-0 fixed h-[56px] w-full flex justify-center bg-black/[0.075] backdrop-blur-sm">
        <div className="flex justify-between items-center h-full w-full max-w-[1200px]">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoImg} alt="logo" className="w-[36px] h-[36px]" />
            <p className="text-white font-semibold text-xl">My Blog</p>
          </Link>
          <div className="flex gap-6 items-center text-white">
            <button onClick={handleSearchbtnClick}>
              <i className="fi fi-rr-search"></i>
            </button>

            <Link to="/blog/write">
              <i className="fi fi-rr-edit"></i>
            </Link>

            {access_token ? (
              <>
                <Link to="/notice/reply">
                  <i className="fi fi-rr-bell"></i>
                </Link>
                <div
                  className="relative"
                  onClick={handleUserNavPanel}
                  onBlur={handleBlur}
                >
                  <button className="w-7 h-8">
                    {profile_img ? (
                      <img
                        src={profile_img}
                        alt="avatar"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-gray-300 rounded-full w-full h-full"></div>
                    )}
                  </button>
                  {userNavPanel ? <UserNavigationPanel /> : null}
                </div>
              </>
            ) : (
              <button onClick={handleModal}>
                <i className="fi fi-rr-circle-user"></i>
              </button>
            )}
          </div>
        </div>
      </nav>
      <SearchModal modalpannel={searchModal} setModalPannel={setSearchModal} />
      <UserAuthForm modalpannel={modalpannel} setModalPannel={setModalPannel} />
    </>
  );
};

export default Navbar;
