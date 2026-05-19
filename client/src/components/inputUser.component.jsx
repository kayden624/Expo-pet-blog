const InputBoxUser = ({
  name,
  value,
  labelName,
  placeholder,
  required = false,
  type = "text",
}) => {
  return (
    <label className="flex flex-col gap-1 pb-4">
      <span className="text-gray-600">
        {labelName}
        {!required ? "" : <span className="text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        className="bg-gray-100 p-3 w-full border border-gray-300 rounded-md focus:border-purple-500 focus:ring-purple-500 focus:ring-1 outline-none transition-colors duration-300"
        defaultValue={value}
        placeholder={placeholder}
      />
    </label>
  );
};

export default InputBoxUser;
