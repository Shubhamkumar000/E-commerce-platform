import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import {toast} from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate, Link } from "react-router-dom";
import fetchUserDetials from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Store/userSlice";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validateValue = Object.values(data).every(el => el)

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
        const response = await Axios({
            ...SummaryApi.login,
            data : data
        })

        if(response.data.error){
            toast.error(response.data.message);
        }

        if(response.data.success){
            toast.success(response.data.message);
            localStorage.setItem('accessToken',response.data.data.accessToken);
            localStorage.setItem('refreshToken',response.data.data.refreshToken);

            const userDetails = await fetchUserDetials();
            dispatch(setUserDetails(userDetails.data))

            setData({
                email: "",
                password: "",
            })
            navigate('/');
        }
    } catch (error) {
        AxiosToastError(error);      
    }
  }

  return (
    <section className="w-full bg-gradient-to-b from-emerald-50 via-slate-50 to-amber-50/40">
      <div className="container mx-auto px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/70 shadow-xl ring-1 ring-black/5">
          <div className="absolute -top-24 -right-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />

          <div className="relative grid gap-10 p-8 lg:grid-cols-2 lg:p-12">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Blinkit
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 lg:text-4xl">
                  Welcome back
                </h1>
                <p className="mt-3 text-sm text-slate-600">
                  Sign in to continue shopping fresh, fast, and local.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <p>Real-time order updates and quick reorders.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <p>Curated deals based on your shopping history.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <p>Checkout in seconds with saved addresses.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    autoFocus
                    className="bg-slate-50 p-3 border border-slate-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid gap-1">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                  <div className="bg-slate-50 p-3 border border-slate-200 rounded-lg flex items-center gap-2 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full bg-transparent outline-none"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-500 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                    </button>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={!validateValue}
                  className={`${validateValue ? "bg-emerald-700 hover:bg-emerald-600" : "bg-slate-300 cursor-not-allowed"} text-white p-3 rounded-lg font-semibold tracking-wide transition`}
                >
                  Login
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
