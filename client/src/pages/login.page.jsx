import { useContext, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import InputBox from "../components/input.component";
import newRequest from "../servers";
import { UserAuthContext } from "../hooks/userAuthContext";
import { storeInSession } from "../servers/sessions";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // 引用表单元素，用于获取表单数据
  const authForm = useRef();
  // 从用户认证上下文获取设置用户认证状态的函数
  const { setUserAuth } = useContext(UserAuthContext);
  // 当前表单状态，初始为登录状态
  const [currentForm, setCurrentForm] = useState("login");
  // 用于引用切换表单类型的按钮元素
  const activeBtnRef = useRef([]);
  // 用于页面导航的函数
  const navigate = useNavigate();

  // 切换表单类型的函数
  const toggleForm = (formName, index) => {
    setCurrentForm(formName);
    activeBtnRef.current.forEach((tab, i) => {
      if (tab) {
        tab.style.backgroundColor = i === index ? "gray" : "";
      }
    });
  };

  // 处理表单提交的函数
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(authForm.current);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    const request_path =
      currentForm === "login" ? "/user/signin" : "/user/signup";

    newRequest
      .post(request_path, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        toast.success("Success");
        navigate("/");
      })
      .catch(({ response }) => {
        // 处理错误信息，提供默认错误提示
        const errorMessage =
          response.data?.error || "An error occurred during the request.";
        toast.error(errorMessage);
      });
  };

  return (
    <>
      <Toaster />
      <div className="grid place-items-center h-[100vh] bg-grey">
        <div className="w-[100%] max-w-[400px] bg-white p-6">
          <div className="flex gap-6 top-8 left-5">
            <button
              className={`px-3 hover:bg-dark-grey ${
                currentForm === "login" ? "bg-dark-grey" : ""
              }`}
              onClick={() => toggleForm("login", 0)}
              ref={(el) => (activeBtnRef.current[0] = el)}
            >
              Login
            </button>
            <button
              className={`px-3 hover:bg-dark-grey ${
                currentForm === "register" ? "bg-dark-grey" : ""
              }`}
              onClick={() => toggleForm("register", 1)}
              ref={(el) => (activeBtnRef.current[1] = el)}
            >
              Register
            </button>
          </div>
          <form ref={authForm} className="mt-2">
            {currentForm === "register" ? (
              <InputBox
                name="username"
                type="text"
                placeholder="Username (3–20 letters, numbers, or underscores)"
              />
            ) : null}
            <InputBox
              name="email"
              type="text"
              placeholder="Please enter your email"
            />
            <InputBox
              name="password"
              type="password"
              placeholder={
                currentForm === "login"
                  ? "Please enter your password carefully"
                  : "Please set your password"
              }
            />
            <button
              className="bg-red w-[100%] py-2 text-white"
              onClick={handleSubmit}
            >
              {currentForm === "login" ? "Login" : "Confirm Registration"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
