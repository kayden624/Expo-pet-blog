const ScrollToTop = () => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="fixed bottom-10 right-8">
      <button
        className="w-12 h-12 rounded-full bg-purple-500 text-white p-3 flex items-center justify-center shadow-md hover:bg-purple-600 transition-colors duration-300"
        onClick={handleClick}
      >
        <i className="fi fi-rr-arrow-to-top"></i>
      </button>
    </div>
  );
};

export default ScrollToTop;
