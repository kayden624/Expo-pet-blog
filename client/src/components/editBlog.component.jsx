import { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import UserNavigationPanel from "./user-navigation.component";
import LogoImg from "/public/logo.svg";
import defaultBanner from "../imgs/blog_banner.png";
import { EditorContext } from "../contexts/editorContext";
import { UserAuthContext } from "../hooks/userAuthContext";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../utils/tools";
import { Link, useNavigate, useParams } from "react-router-dom";
import { uploadImage } from "../servers/uploadFile";
import newRequest from "../servers";

const EditBlogComponent = () => {
  // 从编辑器上下文获取博客相关信息和设置函数
  const {
    blog,
    blog: { title, banner, content, tags },
    setBlog,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  // 从用户认证上下文获取用户认证信息
  const {
    userAuth: { access_token, profile_img, _id },
  } = useContext(UserAuthContext);

  const { blog_id } = useParams();
  const navigate = useNavigate();

  // 评论权限开关状态
  const [ischecked, setChecked] = useState(true);
  // 用户导航面板显示状态
  const [userNavPanel, setUserNavPanel] = useState(false);
  // 右侧面板显示状态
  const [rightPannel, setRightPannel] = useState(true);

  const tagLimit = 5;

  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // 处理用户导航面板失去焦点事件
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  // 切换用户导航面板显示状态
  const handleUserNavPanel = () => {
    setUserNavPanel((preVal) => !preVal);
  };

  // 处理博客发布操作
  const handleBlogPublish = () => {
    if (!title.length) {
      return toast.error("The title cannot be empty!");
    }

    if (!banner.length) {
      return toast.error("The background image cannot be empty!");
    }

    if (!tags.length) {
      return toast.error("Tags cannot be empty!");
    }

    if (textEditor.isReady) {
      const loadingToast = toast.loading("publishing...");

      textEditor.save().then((data) => {
        setBlog({ ...blog, content: data });
        const blogObj = { title, banner, tags, content: data, draft: false };
        // 新建后就发布，id:null
        newRequest
          .post(
            "/blog/create",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success("Published.");

            setTimeout(() => {
              navigate("/");
            }, 500);
            // create notify
            newRequest
              .post(
                "/notification",
                { type: "createBlog", blog: data.id, user: _id },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              )
              .then(() => {
                console.log("success");
              });
          })
          .catch(({ response }) => {
            toast.dismiss(loadingToast);
            return toast.error(response.data || response.statusText);
          });
      });
    }
  };

  // 处理背景图片错误加载事件
  const handleError = (e) => {
    const img = e.target;
    img.src = defaultBanner;
  };

  // 处理背景图片上传事件
  const handleBannerUpload = (e) => {
    const img = e.target.files[0];
    if (img) {
      const loadingToast = toast.loading("Uploading...");
      uploadImage(img).then((url) => {
        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded!");

          setBlog({ ...blog, banner: url });
        }
      });
    }
  };

  // 处理标题输入框按下键盘事件
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  // 处理标题输入框内容变化事件
  const handleTitleChange = (e) => {
    const input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  // 处理标签添加事件
  const handleTagAdd = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add a maximum of ${tagLimit} tags`);
      }

      e.target.value = "";
    }
  };

  // 处理标签删除事件
  const handleTagDelete = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags: newTags });
  };

  useEffect(() => {
    const editor = new EditorJS({
        holder: "editorjs",
        tools: tools,
        placeholder: "Please enter...",
        data: Array.isArray(content) ? content[0] : content,
      });
    setTextEditor(editor);
    return () => {
      editor.destroy();
    };
  }, [content, setTextEditor]);

  return (
    <div className="bg-white">
      <Toaster />
      <nav className="sticky top-0 left-0 w-[100%] border-b border-grey bg-white z-50">
        <div className="w-[80%] mx-auto flex justify-between py-5">
          <div className="flex items-center gap-6 text-dark-grey">
            <Link to="/">
              <img src={LogoImg} className="w-[36px] h-[36px]" />
            </Link>
          </div>
          <div className="flex gap-7 items-center">
            <Link to="/">Drafts</Link>
            <Link to="/">New Article</Link>
            <Link to="/" className="text-red">
              Delete
            </Link>
            <button onClick={handleBlogPublish}>Publish</button>
            <span className="border-l border-grey h-[60%]"></span>
            <button>
              <i className="fi fi-rr-bell"></i>
            </button>
            <div
              className="relative"
              onClick={handleUserNavPanel}
              onBlur={handleBlur}
            >
              <button className="w-[30px] h-[30px] ">
                <img src={profile_img} alt="user" className="rounded-full " />
              </button>
              {userNavPanel ? <UserNavigationPanel /> : null}
            </div>
          </div>
        </div>
      </nav>
      {/* 正文 */}
      <div className="py-8 w-[100%]">
        <div className="mx-auto flex justify-center">
          <div className=" mr-3">
            <div className="relative aspect-video bg-white border-4 border-grey max-w-[680px]">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Please enter the title..."
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <div className="min-w-[680px]" id="editorjs"></div>
          </div>

          {rightPannel ? (
            <div className="sticky top-[100px] right-0 h-[100%] max-h-[500px] w-[220px]">
              <section className="flex flex-col gap-4">
                <p className="font-bold">Article Information</p>
                <p>Created on {getCurrentTime()}</p>
              </section>
              <span className="block border-b-2 border-grey w-[100%] my-4"></span>
              <section className="flex flex-col gap-4">
                <p className="font-bold">Article Settings</p>
                <label className="flex justify-between items-center">
                  <span>Allow Comments</span>
                  <input
                    type="checkbox"
                    name="isCommented"
                    defaultChecked={ischecked}
                    onChange={() => {
                      setChecked((preVal) => !preVal);
                    }}
                  />
                </label>
                <label className="flex flex-col">
                  <span>Tags</span>
                  <input
                    type="text"
                    name="tags"
                    className="bg-grey p-2 placeholder:Enter and press Enter to confirm the tag"
                    onKeyDown={handleTagAdd}
                  />
                </label>
                <div className="flex gap-1 flex-wrap">
                  {tags.map((tag, i) => {
                    return (
                      <button
                        key={i}
                        className="bg-grey py-1 px-2 hover:bg-dark-grey flex items-center gap-2"
                        onClick={() => handleTagDelete(tag)}
                      >
                        {tag}
                        <i className="fi fi-rr-circle-xmark"></i>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          ) : null}
          {/* 右侧面板弹出和隐藏 */}
          <button
            className="sticky top-[100px] right-1 bg-grey p-2 w-[26px] h-[26px] rounded-full flex items-center"
            onClick={() => setRightPannel((preVal) => !preVal)}
          >
            {rightPannel ? (
              <i className="fi fi-rr-angle-double-small-right"></i>
            ) : (
              <i className="fi fi-rr-angle-double-small-left"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogComponent;
