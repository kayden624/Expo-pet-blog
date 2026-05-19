import toast, { Toaster } from "react-hot-toast";
import InputBoxUser from "../components/inputUser.component";
import { useContext, useRef, useState } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";
import newRequest from "../servers";

const EditPassword = () => {
  let {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuthContext);

  let passwdForm = useRef();
  const [isVerified, setVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(passwdForm.current);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    if (!formData.password || !formData.password_confirmed) {
      return toast.error("Please enter the password before submitting!");
    }

    if (formData.password !== formData.password_confirmed) {
      return toast.error(
        "The passwords entered twice do not match. Please correct and submit!"
      );
    }

    newRequest
      .put("/user/password", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        toast.success("Submitted successfully");
        setUserAuth({ ...userAuth, user: response.data.user });
        setVerified(false);
        passwdForm.current.reset();
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        toast.error("Failed to update password. Please try again later.");
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const form = new FormData(passwdForm.current);
    const formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    newRequest
      .post("/user/password", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        toast.success("Verification successful");
        setVerified(true);
        passwdForm.current.reset();
      })
      .catch((err) => {
        console.error("Error verifying password:", err);
        toast.error(
          "Verification failed. Please check your input and try again."
        );
      });
  };

  return (
    <div className="bg-white flex-[8_1_0%] shadow-md">
      <Toaster />
      <div className="py-[20px] pl-[20px] border-b border-grey">
        <span>Password</span>
      </div>
      <div className="flex gap-8 p-5 flex-col">
        <form ref={passwdForm}>
          {!isVerified ? (
            <>
              <InputBoxUser
                type="password"
                name="old_password"
                labelName="Current Password"
                placeholder="Please enter the original password"
                required={true}
              />
              <button
                className="bg-grey text-red px-10 py-3 rounded-full my-10 hover:bg-red hover:text-grey"
                onClick={handleVerify}
              >
                Change Password
              </button>
            </>
          ) : (
            <>
              <InputBoxUser
                name="password"
                labelName="New Password"
                placeholder="Please enter the new password"
                required={true}
              />
              <InputBoxUser
                name="password_confirmed"
                labelName="Confirm New Password"
                placeholder="Please enter the new password again. The two passwords must match."
                required={true}
              />
              <button
                className="bg-grey text-red px-10 py-3 rounded-full my-10 hover:bg-red hover:text-grey"
                onClick={handleSubmit}
              >
                Save
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditPassword;
