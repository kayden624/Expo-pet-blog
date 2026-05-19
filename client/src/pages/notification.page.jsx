import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("reply");

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-grey py-[100px] w-full">
      <div className="mx-auto w-[40%]">
        <h2>All Messages</h2>
        <span className="border-b border-dark-grey block my-4"></span>
        <div className="flex justify-between px-4">
          <Link
            to="reply"
            className={`notice-tab ${activeTab === "reply" ? "active" : ""}`}
            onClick={() => handleLinkClick("reply")}
          >
            Replies
          </Link>
          <Link
            to="comment"
            className={`notice-tab ${activeTab === "comment" ? "active" : ""}`}
            onClick={() => handleLinkClick("comment")}
          >
            Comments
          </Link>
          <Link
            to="system"
            className={`notice-tab ${activeTab === "system" ? "active" : ""}`}
            onClick={() => handleLinkClick("system")}
          >
            System
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default NotificationPage;
