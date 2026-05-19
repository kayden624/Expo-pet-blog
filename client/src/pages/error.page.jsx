import { Link } from "react-router-dom";
import error_img from "/public/404.svg";

const ErrorPage = () => {
  return (
    <div className="w-[80%] mx-auto text-center">
      <img src={error_img} alt="page not found" className="w-[60%] mx-auto" />
      <p className="text-2xl my-3">
        Sorry, the page you are trying to view does not exist or has been
        deleted.
      </p>
      <button className="text-red bg-grey px-3 py-2 rounded-md hover:bg-red hover:text-white">
        <Link to="/">Back to Home Page</Link>
      </button>
    </div>
  );
};

export default ErrorPage;
