import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ modalpannel, setModalPannel }) => {
  // 搜索输入框的值
  const [searchValue, setSearchValue] = useState("");
  // 路由导航函数
  const navigate = useNavigate();

  // 处理搜索事件
  const handleSearch = (e) => {
    // 按下回车键
    if (e.keyCode === 13) {
      if (searchValue.trim().length === 0) {
        // 搜索值为空时导航到指定页面
        navigate("/whoose");
      } else {
        // 搜索值不为空时导航到搜索结果页面
        navigate(`/search/blog/${searchValue}`);
      }
      // 关闭模态框
      setModalPannel((preVal) => !preVal);
      // 清空搜索输入框
      setSearchValue("");
    }
  };

  return modalpannel ? (
    <div className="fixed left-0 top-[56px] w-full h-full overflow-hidden bg-black/50 flex z-50">
      <div className="bg-white p-16 w-full max-h-[150px] relative top-0 left-0 flex items-center justify-center gap-3">
        <i className="fi fi-rr-search text-3xl text-dark-grey"></i>
        <input
          value={searchValue}
          type="text"
          placeholder="Please enter to search..."
          className="text-3xl"
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          onKeyDown={handleSearch}
        />
      </div>
    </div>
  ) : null;
};

export default SearchModal;
