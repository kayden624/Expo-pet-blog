import { createContext, useContext, useEffect, useState } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";
import { Navigate, useParams } from "react-router-dom";
import EditBlogComponent from "../components/editBlog.component";
import newRequest from "../servers";
import Loader from "../components/loader.component";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let {
    userAuth: { access_token },
  } = useContext(UserAuthContext);

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [textEditor, setTextEditor] = useState({ isReady: false });

  let { blog_id } = useParams();

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    newRequest
      .get(`/blog/${blog_id}/edit`, { mode: "edit" })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setBlog(null);
        setLoading(false);
      });
  }, []);

  return (
    <EditorContext.Provider
      value={{ blog, setBlog, textEditor, setTextEditor }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : (
        <EditBlogComponent />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
