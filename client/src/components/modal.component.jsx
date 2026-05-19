const Modal = ({ setModalState, children }) => {
  return (
    <div
      className={
        "fixed left-0 top-0 w-full h-full overflow-hidden bg-black/50 flex justify-center items-center z-50"
      }
    >
      <div className="bg-white m-auto p-8 w-[90%] max-w-[430px] text-center relative rounded-lg shadow-lg">
        <button
          className="absolute top-3 right-3 text-lg text-gray-600 hover:text-gray-800 transition-colors duration-300"
          onClick={() => setModalState((preVal) => !preVal)}
        >
          <i className="fi fi-ts-circle-xmark text-2xl"></i>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
