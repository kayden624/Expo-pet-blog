import { useState } from "react";

const InputBox = ({ name, type, placeholder }) => {
  const [isPasswd, setPasswd] = useState(true);

  return (
    <div className="relative mb-4">
      <input
        className="w-[100%] p-4 bg-white border border-grey placeholder:text-dark-grey focus:border-transparent focus:bg-grey"
        name={name}
        type={type === "password" ? (isPasswd ? "password" : "text") : type}
        placeholder={placeholder}
      />
      {type === "password" ? (
        <i
          className={
            "fi fi-rr-eye" +
            (isPasswd ? "-crossed" : "") +
            " absolute top-1/2 -translate-y-1/2 left-[auto] right-4 cursor-pointer"
          }
          onClick={() => setPasswd((preVal) => !preVal)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
