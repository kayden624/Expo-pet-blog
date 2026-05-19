import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import newRequest from "../servers";

// 默认的搜索计数对象
const defaultSearchCount = {
  userCount: 0,
  blogCount: 0,
};

const SearchPage = () => {
  // 从路由参数中获取搜索值
  const { search_value } = useParams();
  // 用于存储输入框的值，初始值为路由参数中的搜索值
  const [inputValue, setInputValue] = useState(search_value);
  // 用于页面导航的函数
  const navigate = useNavigate();
  // 用于存储搜索结果中用户和文章的计数
  const [searchCounts, setSearchCount] = useState(defaultSearchCount);

  // 处理搜索输入框的按键事件
  const handleSearch = (e) => {
    // 使用严格相等运算符进行比较
    if (e.keyCode === 13) {
      if (inputValue.trim().length === 0) {
        navigate("/whoose");
      } else {
        navigate(`/search/blog/${inputValue}`);
      }
    }
  };

  // 获取过滤后的用户数量
  const getFilterUserCount = () => {
    newRequest
      .get("/search/user/counts", { params: { keyValue: search_value } })
      .then(({ data: { totalDocs } }) => {
        setSearchCount((prevState) => ({ ...prevState, userCount: totalDocs }));
      })
      .catch((error) => {
        console.error("Error fetching user count:", error);
      });
  };

  // 获取过滤后的文章数量
  const getFilterBlogCount = () => {
    newRequest
      .get("/search/blog/counts", { params: { keyValue: search_value } })
      .then(({ data: { totalDocs } }) => {
        setSearchCount((prevState) => ({ ...prevState, blogCount: totalDocs }));
      })
      .catch((error) => {
        console.error("Error fetching blog count:", error);
      });
  };

  // 当搜索值变化时，重新获取用户和文章的计数
  useEffect(() => {
    getFilterUserCount();
    getFilterBlogCount();
  }, [search_value]);

  return (
    <div className="py-20 w-full">
      <input
        type="text"
        value={inputValue}
        className="bg-grey px-4 py-6 my-8 w-[50%] mx-auto block"
        onKeyDown={handleSearch}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <div className="w-[70%] mx-auto my-3">
        <NavLink to={`blog/${search_value}`} className="search-link">
          Articles ({searchCounts.blogCount})
        </NavLink>
        <NavLink to={`user/${search_value}`} className="search-link">
          Users ({searchCounts.userCount})
        </NavLink>
      </div>
      <div className="bg-grey w-full py-[50px]">
        <Outlet />
      </div>
    </div>
  );
};

export default SearchPage;
