import { useCallback, useContext, useEffect, useState } from "react";
import newRequest from "../servers";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/noDataMessage.component";
import { UserAuthContext } from "../hooks/userAuthContext";
import toast from "react-hot-toast";
import LoadMoreBtn from "../components/loadMoreBtn.component";

const SearchUserPage = () => {
  // 从路由参数中获取搜索值
  const { search_value } = useParams();
  // 从用户认证上下文获取访问令牌和用户ID
  const {
    userAuth: { access_token, _id },
  } = useContext(UserAuthContext);

  // 初始化过滤后的用户列表状态
  const [filterUsers, setFilterUsers] = useState(null);

  // 获取搜索用户数据的函数
  const fetchData = useCallback((page = 1, limit = 2, isNew) => {
    newRequest
      .get("/search/user", { params: { keyValue: search_value, page, limit } })
      .then(({ data }) => {
        setFilterUsers((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : data);
      })
      .catch((error) => {
        console.error("Error fetching search user data:", error);
      });
  }, [search_value]);

  // 当搜索值变化时，获取搜索用户数据
  useEffect(() => {
    fetchData(1, 2, true);
  }, [fetchData]);

  // 处理关注/取消关注用户的函数
  const handleFollow = (e, item) => {
    e.preventDefault();
    if (access_token === null) {
      toast.error("Please log in first!");
    } else {
      const isFollowing = item.verified_followers.includes(_id);
      if (isFollowing) {
        item.verified_followers = item.verified_followers.filter(
          (p) => p !== _id
        );
        item.activity.total_verfied_followers--;
      } else {
        item.verified_followers.push(_id);
        item.activity.total_verfied_followers++;
      }
      const updatedResults = filterUsers.results.map((t) => {
        if (t._id === item._id) {
          return item;
        } else {
          return t;
        }
      });
      setFilterUsers({ ...filterUsers, results: updatedResults });
      newRequest
        .post(
          "/user/follow",
          { followUserId: item.userId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(() => {
          toast.success("Operation successful");
        })
        .catch((error) => {
          console.error("Error following user:", error);
          toast.error("Failed to perform the operation. Please try again.");
        });
    }
  };

  return (
    <>
      <div className="w-[70%] mx-auto flex flex-wrap gap-2">
        {/* Card */}
        {filterUsers === null ? (
          <Loader />
        ) : filterUsers.results.length === 0 ? (
          <NoDataMessage message="No data available" />
        ) : (
          filterUsers.results.map((item, i) => {
            return (
              <Link
                to={`/user/${item.userId}`}
                key={i}
                className="relative bg-white w-[33%] rounded-md p-4"
              >
                {item._id !== _id && (
                  <button
                    className={`absolute top-5 right-5 bg-gray-200 p-2 rounded-md flex items-center gap-2 ${
                      item.verified_followers.includes(_id)
                        ? "text-green"
                        : "text-red"
                    }`}
                    onClick={(e) => {
                      handleFollow(e, item);
                    }}
                  >
                    {item.verified_followers.includes(_id) ? (
                      <i className="fi fi-br-check"></i>
                    ) : (
                      <>
                        <i className="fi fi-rr-add"></i> Follow
                      </>
                    )}
                  </button>
                )}
                <img
                  src={item.personal_info.profile_img}
                  alt="Profile"
                  className="w-[48px] h-[48px] rounded-full"
                />
                <span className="text-xl inline-block my-2">
                  {item.personal_info.username}
                </span>
                <p className="line-clamp-1 text-gray-700">
                  {item.personal_info.bio}
                </p>
                <div className="flex gap-3 mt-4">
                  <p>
                    {item.activity.total_verfied_followers} people are following
                  </p>
                  <p>{item.activity.total_posts} articles</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <LoadMoreBtn data={filterUsers} fetchDataFun={fetchData} />
    </>
  );
};

export default SearchUserPage;
