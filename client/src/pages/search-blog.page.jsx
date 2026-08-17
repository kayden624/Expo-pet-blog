import { useParams } from "react-router-dom";
import newRequest from "../servers";
import { useCallback, useEffect, useState } from "react";
import NoDataMessage from "../components/noDataMessage.component";
import SearchBlogCard from "../components/searchBlogCard.component";
import Loader from "../components/loader.component";
import LoadMoreBtn from "../components/loadMoreBtn.component";

const SearchBlogPage = () => {
  // 从路由参数中获取搜索值
  const { search_value } = useParams();

  // 初始化过滤后的博客列表状态
  const [filterBlogs, setFilterBlogs] = useState(null);

  // 获取搜索博客数据的函数
  const fetchSearchBlogData = useCallback((page = 1, limit = 2, isNew) => {
    newRequest
      .get("/search/blog", { params: { keyValue: search_value, page, limit } })
      .then(({ data }) => {
        setFilterBlogs((current) => current !== null && !isNew
          ? { ...current, results: [...current.results, ...data.results], pageIndex: data.pageIndex }
          : data);
      })
      .catch((error) => {
        console.error("Error fetching search blog data:", error);
      });
  }, [search_value]);

  // 当搜索值变化时，获取搜索博客数据
  useEffect(() => {
    fetchSearchBlogData(1, 2, true);
  }, [fetchSearchBlogData]);

  return (
    <>
      <div className="w-[70%] mx-auto">
        {filterBlogs === null ? (
          <Loader />
        ) : filterBlogs.results.length === 0 ? (
          <NoDataMessage message="No corresponding search results" />
        ) : (
          filterBlogs.results.map((item, i) => {
            return (
              <SearchBlogCard
                key={i}
                title={item.title}
                summer={item.summer}
                blog={item.blog}
              />
            );
          })
        )}
      </div>
      <LoadMoreBtn data={filterBlogs} fetchDataFun={fetchSearchBlogData} />
    </>
  );
};

export default SearchBlogPage;
