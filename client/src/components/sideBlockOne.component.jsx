import defaultImg from "../imgs/defaultImg.jpg";

const SidebarBlockOne = () => {
  return (
    <>
      {/* 侧边栏的单个内容块，包含文本和图片 */}
      <div className="flex gap-2 py-2">
        <div>
          {/* 问题标题，最多显示两行 */}
          <p className="line-clamp-2">What good things did you buy in June?</p>
          <div className="flex gap-2">
            <i className="fi fi-rr-waveform text-red"></i>
            {/* 讨论的编号 */}
            <p>Discussion VOL.164</p>
          </div>
        </div>
        {/* 显示默认图片 */}
        <img
          src={defaultImg}
          alt="Default Image"
          className="w-[65px] h-[35px] rounded"
        />
      </div>
      {/* 分割线 */}
      <span className="block border-b border-grey"></span>
    </>
  );
};

export default SidebarBlockOne;
