import { useContext, useRef, useState } from "react";
import InputBox from "./input.component";
import Modal from "./modal.component";
import newRequest from "../servers";
import { storeInSession } from "../servers/sessions";
import { toast, Toaster } from "react-hot-toast";
import { UserAuthContext } from "../hooks/userAuthContext";

const UserAuthForm = ({ modalpannel, setModalPannel }) => {
  // 引用表单元素
  const authForm = useRef();
  // 从用户认证上下文获取设置用户认证状态的函数
  const { setUserAuth } = useContext(UserAuthContext);

  // 当前表单状态，初始为登录
  const [currentForm, setCurrentForm] = useState("login");
  // 引用切换按钮元素
  const activeBtnRef = useRef([]);

  // 切换表单类型
  const toggleForm = (formName, index) => {
    setCurrentForm(formName);
    activeBtnRef.current.forEach((tab, i) => {
      if (tab) {
        tab.style.backgroundColor = i === index ? "gray" : "";
      }
    });
  };

  // 处理表单提交
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
        setModalPannel(false);
      })
      .catch(({ response }) => {
        toast.error(response.data?.error || "An error occurred");
      });
  };

  return (
    <>
      <Toaster />
      {modalpannel ? (
        <Modal setModalState={setModalPannel}>
          {/* 表单切换按钮 */}
          <div className="flex gap-6 mt-4 justify-center">
            <button
              className="px-3 hover:bg-dark-grey"
              onClick={() => toggleForm("login", 0)}
              ref={(el) => (activeBtnRef.current[0] = el)}
            >
              Login
            </button>
            <button
              className="px-3 hover:bg-dark-grey"
              onClick={() => toggleForm("register", 1)}
              ref={(el) => (activeBtnRef.current[1] = el)}
            >
              Register
            </button>
          </div>
          <form ref={authForm} className="mt-4 p-4">
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
        </Modal>
      ) : null}
    </>
  );
};

export default UserAuthForm;
