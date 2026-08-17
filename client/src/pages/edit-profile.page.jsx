import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../hooks/userAuthContext";
import newRequest from "../servers";
import InputBoxUser from "../components/inputUser.component";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/loader.component";
import { uploadImage } from "../servers/uploadFile";
import { storeInSession } from "../servers/sessions";

// export const profileDataStructure = {
//   personal_info: {
//     email: "",
//     username: "",
//     profile_img: "",
//     bio: "",
//   },
//   joinedAt: "",
// };

const EditProfile = () => {
  let {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserAuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedImg, setUpdatedImg] = useState("");

  // let {
  //   personal_info: { username, bio },
  // } = profile;

  let profileImgRef = useRef();
  let InfoRef = useRef();

  useEffect(() => {
    if (access_token) {
      newRequest
        .get(`/user/${userAuth.userId}/profile`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data: { user } }) => {
          // console.log(user);
          setProfile(user);
          setUpdatedImg(user.personal_info.profile_img);
          setLoading(false);
        });
    }
  }, [access_token, userAuth.userId]);

  const handleImagePreviewAndUpload = (e) => {
    let img = e.target.files[0];
    // console.log(img);

    if (img) {
      profileImgRef.current.src = URL.createObjectURL(img);
      let loadingToast = toast.loading("Uploading...");

      uploadImage(img)
        .then((url) => {
          setUpdatedImg(url);
          toast.success("Uploaded!");
        })
        .catch((error) => {
          console.error("Profile image upload failed:", error);
          toast.error("Upload failed. Please try again.");
        })
        .finally(() => {
          e.target.removeAttribute("disabled");
          toast.dismiss(loadingToast);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let form = new FormData(InfoRef.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let updateProfile = {
      ...formData,
      profile_img: updatedImg,
    };

    // console.log("updatedProfile: ", updateProfile);

    let loadingToast = toast.loading("Uploading...");
    // e.target.setAttribute("disabled", true);

    newRequest
      .put(
        `/user/${userAuth.userId}/profile`,
        { ...updateProfile },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data: { user } }) => {
        // console.log(user);
        let newUserAuth = {
          ...userAuth,
          profile_img: updatedImg,
          username: user.personal_info.username,
        };

        // console.log("newUserAuth：", newUserAuth);

        setUserAuth(newUserAuth);
        storeInSession("user", JSON.stringify(newUserAuth));

        toast.dismiss(loadingToast);
        e.target.removeAttribute("disabled");

        toast.success("Submit successfully");
      })
      .catch((err) => {
        console.error("Profile update failed:", err);
        toast.error("Profile update failed. Please try again.");
      })
      .finally(() => {
        e.target.removeAttribute("disabled");
        toast.dismiss(loadingToast);
      });
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="bg-white flex-[8_1_0%] shadow-md">
      <Toaster />
      <div className="py-[20px] pl-[20px] border-b border-grey">
        <span>Profile</span>
      </div>

      <form ref={InfoRef} className="flex gap-8 p-5">
        <div className="flex-[2_1_0%] flex gap-4 flex-col">
          <img
            ref={profileImgRef}
            src={userAuth.profile_img}
            alt="avatar"
            className="w-20 h-20 rounded-full object-contain"
          />
          <label htmlFor="uploadBanner" className="cursor-pointer">
            <i className="fi fi-rr-add-image"></i>
            <span>Upload new avatar</span>
            <input
              name="profile_img"
              id="uploadBanner"
              type="file"
              accept=".png, .jpg"
              hidden
              onChange={handleImagePreviewAndUpload}
            />
          </label>
        </div>

        <div className="flex-[8_1_0%] flex flex-col gap-6 w-[100%]">
          <InputBoxUser
            name="username"
            value={profile.personal_info.username}
            labelName="Nickname"
            required={true}
          />
          <InputBoxUser
            name="bio"
            value={profile.personal_info.bio}
            labelName="Personal Bio"
            placeholder="Briefly introduce yourself to let others know you quickly"
          />
          <button
            className="bg-grey text-red px-10 py-3 rounded-full my-10 hover:bg-red hover:text-grey"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
