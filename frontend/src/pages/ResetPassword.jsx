import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import SummaryApi from "../common/SummaryApi";
import {toast} from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const[showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateValue = Object.values(data).every((el) => el);

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }

    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(data.newPassword !== data.confirmPassword){
        return toast.error("New password and confirm password should be same");
    }

    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login", {
          state: { email: data.email },
        });
        setData({
            email: "",
            newPassword: "",
            confirmPassword: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-100 py-10">
      <div className="pointer-events-none absolute -top-16 left-10 h-44 w-44 rounded-full bg-lime-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-6 h-52 w-52 rounded-full bg-emerald-200/60 blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="bg-white/90 my-4 w-full max-w-xl mx-auto rounded-2xl border border-emerald-100 p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              New password
            </span>
            <p className="text-sm text-slate-500">Choose a strong password</p>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Use at least 8 characters with a mix of letters and numbers.
          </p>

          <form className="grid gap-5 py-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                New password
              </label>
              <div className="bg-white p-3 border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  autoFocus
                  className="w-full bg-transparent outline-none"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={handleChange}
                  placeholder="Enter a new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <div className="bg-white p-3 border border-slate-200 rounded-xl flex items-center gap-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full bg-transparent outline-none"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <button
              disabled={!validateValue}
              className={`${
                validateValue
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-slate-300"
              } text-white px-4 py-3 rounded-xl font-semibold tracking-wide shadow-md transition`}
            >
              Change Password
            </button>
          </form>

          <p className="text-sm text-slate-600">
            Already have account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
