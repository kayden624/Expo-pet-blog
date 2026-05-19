import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import HomePage from "./pages/home.page";
import Navbar from "./components/navbar.component";
import { UserAuthProvider } from "./hooks/userAuthContext";
import UserInfo from "./pages/userInfo.page";
import Sidebar from "./components/sidebar.component";
import EditProfile from "./pages/edit-profile.page";
import EditPassword from "./pages/edit-password.page";
import EditEmail from "./pages/edit-email.page";
import UserBlogsPage from "./pages/user-blog.page";
import UserFavBlogsPage from "./pages/user-favBlogs.page";
import BlogPage from "./pages/blog.page";
import LoginPage from "./pages/login.page";
import Editor from "./pages/editorBlog.page";
import ErrorPage from "./pages/error.page";
import SearchPage from "./pages/search.page";
import SearchUserPage from "./pages/search-user.page";
import SearchBlogPage from "./pages/search-blog.page";
import UserNotificationPage from "./pages/user-notification.page";
import NotificationPage from "./pages/notification.page";
import NoticeCommentPage from "./pages/notice-comment";
import NoticeReplyPage from "./pages/notice-reply.page";

// 1) set outlet
function RootLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-16 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user/:id",
        element: <UserInfo />,
        children: [
          { path: "updates", element: <UserNotificationPage /> },
          { path: "blogs", element: <UserBlogsPage /> },
          { path: "favblogs", element: <UserFavBlogsPage /> },
        ],
      },
      {
        path: "setting",
        element: <Sidebar />,
        children: [
          { path: "profile", element: <EditProfile /> },
          {
            path: "account",
            element: <EditEmail />,
          },
          {
            path: "password",
            element: <EditPassword />,
          },
        ],
      },
      {
        path: "blog/:blog_id",
        element: <BlogPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
        children: [
          { path: "blog/:search_value", element: <SearchBlogPage /> },
          { path: "user/:search_value", element: <SearchUserPage /> },
        ],
      },
      {
        path: "notice",
        element: <NotificationPage />,
        children: [
          { path: "comment", element: <NoticeCommentPage /> },
          { path: "reply", element: <NoticeReplyPage /> },
          { path: "system", element: <h2>system</h2> },
        ],
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
  {
    path: "blog/write",
    element: <Editor />,
  },
  {
    path: "blog/write/:blog_id",
    element: <Editor />,
  },
  {
    path: "signin",
    element: <LoginPage />,
  },
]);

const App = () => {
  return (
    <UserAuthProvider>
      <RouterProvider router={router} />
    </UserAuthProvider>
  );
};

export default App;
