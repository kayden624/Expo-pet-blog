import { useEffect, useState } from "react";
import { homeBanner } from "../utils/data";

const Carousel = ({ interval = 3000 }) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  let images = homeBanner;

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setBannerIndex((prevIndex) => (prevIndex + 1) % images.length);
  //     }, interval);

  //     return () => clearInterval(timer);
  //   }, [images.length, interval]);

  const handlePre = () => {
    if (bannerIndex == 0) {
      setBannerIndex(homeBanner.length - 1);
    } else {
      setBannerIndex((prevVal) => prevVal - 1);
    }
  };

  const handleNext = () => {
    if (bannerIndex == homeBanner.length - 1) {
      setBannerIndex(0);
    } else {
      setBannerIndex((preVal) => preVal + 1);
    }
  };

  return (
    <div
      className=" w-[100%] mx-auto h-[487px] relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <>
          <i
            className="fi fi-sr-angle-left text-black text-2xl bg-grey w-[40px] h-[40px] text-center leading-[40px] cursor-pointer rounded-full absolute top-[50%] left-[25%]"
            onClick={handlePre}
          ></i>
          <i
            className="fi fi-sr-angle-right text-black text-2xl bg-grey w-[40px] h-[40px] text-center leading-[40px] cursor-pointer rounded-full absolute top-[50%] right-[25%]"
            onClick={handleNext}
          ></i>
        </>
      )}

      <img src={homeBanner[bannerIndex].imgUrl} />

      <div></div>
    </div>
  );
};

export default Carousel;
