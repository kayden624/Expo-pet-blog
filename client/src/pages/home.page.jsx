import ScrollToTop from "../components/scrollToTop";
import Carousel from "../components/carousel.component";
import SidebarBlockOne from "../components/sideBlockOne.component";
import HomeBlogList from "../components/homeBlogList.component";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Carousel />
      {/* tab */}
      <div className="w-[1024px] mx-auto flex gap-4 py-8">
        <div className="flex-[75%] bg-white p-6 rounded-lg shadow-md">
          <HomeBlogList />
        </div>

        <div className="flex-[25%] my-4">
          {/* 侧边栏 */}
          <div className="bg-white px-5 py-3 rounded-lg shadow-md">
            <div className="flex py-6 gap-3 items-center">
              <i className="fi fi-br-pancakes text-2xl"></i> <p>Blog One</p>
            </div>
            <SidebarBlockOne />
            <SidebarBlockOne />
            <SidebarBlockOne />
          </div>
        </div>
      </div>
      {/* other */}

      <ScrollToTop />
    </div>
  );
};

export default HomePage;
