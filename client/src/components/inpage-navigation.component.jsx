import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  setPageState,
  children,
}) => {
  let activeTabLineRef = useRef();

  // button
  let activeTabRef = useRef();

  let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, i) => {
    if (btn) {
      let { offsetWidth, offsetLeft } = btn;
      activeTabLineRef.current.style.width = offsetWidth + "px";
      activeTabLineRef.current.style.left = offsetLeft + "px";

      setInPageNavIndex(i);
    }
  };

  useEffect(() => {
    const button = activeTabRef.current;
    if (button && activeTabLineRef.current) {
      activeTabLineRef.current.style.width = `${button.offsetWidth}px`;
      activeTabLineRef.current.style.left = `${button.offsetLeft}px`;
    }
  }, [defaultActiveIndex]);

  return (
    <>
      <div className="flex flex-nowrap overflow-x-auto py-3 gap-3 relative mb-3">
        {routes.map((route, i) => {
          return (
            <button
              className={
                "flex items-center justify-center gap-2 text-xl px-4 " +
                (inPageNavIndex === i ? "text-black " : "text-dark-grey ") +
                (defaultHidden.includes(route.id) ? "hidden " : "")
              }
              key={i}
              ref={i == defaultActiveIndex ? activeTabRef : null}
              onClick={(e) => {
                changePageState(e.target, i);
                setPageState(route.id);
              }}
            >
              {route.name}
            </button>
          );
        })}

        {/* line */}
        <hr
          ref={activeTabLineRef}
          className="absolute bottom-0 border-b border-red"
        />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
