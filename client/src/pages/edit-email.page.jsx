import { Toaster } from "react-hot-toast";
import InputBoxUser from "./../components/inputUser.component";

const EditEmail = () => {
  return (
    <div className="bg-white flex-[8_1_0%] shadow-md">
      <Toaster />
      <div className="py-[20px] pl-[20px] border-b border-grey">
        <span>Account Information</span>
      </div>
      <div className="flex gap-8 p-5 flex-col">
        <form>
          <InputBoxUser name="email" labelName="Account Email" />

          <button className="bg-grey text-red px-10 py-3 rounded-full my-10 hover:bg-red hover:text-grey">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmail;
