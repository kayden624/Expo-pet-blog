import NoDataMessage from "./noDataMessage.component";

const LoadMoreBtn = ({ data, fetchDataFun }) => {
  // 处理加载更多数据的函数
  const getMore = () => {
    if (typeof data.pageIndex === "undefined") {
      console.error("pageIndex is undefined in data object.");
      return;
    }
    // 调用传入的获取数据函数，请求下一页数据
    fetchDataFun(Number(data.pageIndex) + 1, 2, false);
  };

  // 当 data 不为空时进行判断
  if (data !== null) {
    // 若总文档数为 0，不渲染任何内容
    if (data.totalDocs === 0 || data.results == null) {
      return null;
    }
    // 若总文档数大于已加载的文档数，显示加载更多按钮
    else if (data.totalDocs > data.results.length) {
      return (
        <div className="text-center py-3 w-full">
          <button
            onClick={getMore}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors duration-300"
          >
            Load More
          </button>
        </div>
      );
    }
    // 若总文档数等于已加载的文档数，显示已加载完成提示
    else if (data.totalDocs === data.results.length) {
      return <NoDataMessage message="All data has been loaded." />;
    }
  }
  return null;
};

export default LoadMoreBtn;
