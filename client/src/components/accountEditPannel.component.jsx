import { toast, Toaster } from "react-hot-toast";
import InputBoxUser from "./inputUser.component";
import { useContext, useRef } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";

const AccountEditPannel = () => {
  const {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuthContext);

  const accountForm = useRef();

  const handleClick = (e) => {
    e.preventDefault();
    toast.success("Account information updated successfully!");
  };

  return (
    <div className="bg-white flex-[8_1_0%] shadow-md">
      <Toaster />
      <div className="py-[20px] pl-[20px] border-b border-grey">
        <span>Account Information</span>
      </div>
      <div className="flex gap-8 p-5 flex-col">
        <form ref={accountForm}>
          <InputBoxUser
            name="email"
            labelName="Account Email"
            placeholder=""
            required={true}
          />
          <button
            onClick={handleClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Click to Modify
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountEditPannel;
