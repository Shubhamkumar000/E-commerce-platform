import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate, Link, useLocation } from "react-router-dom";

const OtpVertification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([])
  const location = useLocation();

  useEffect(() => {
    if(!location?.state?.email){
        navigate('/forgot-password')
    }
  },[])

  const validateValue = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp,
        data: {
            otp : data.join(""),
            email : location.state?.email
        }
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate('/reset-password',{state : {
          data : response.data,
          email : location.state?.email
        }});
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden bg-gradient-to-br from-amber-50 via-lime-50 to-emerald-100 py-10">
      <div className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-6 h-48 w-48 rounded-full bg-amber-200/60 blur-3xl" />

      <div className="container mx-auto px-6">
        <div className="bg-white/90 my-4 w-full max-w-xl mx-auto rounded-2xl border border-emerald-100 p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              Secure
            </span>
            <p className="text-sm text-slate-500">One-time verification</p>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Enter the 6-digit code</h1>
          <p className="mt-1 text-sm text-slate-500">
            We sent a code to <span className="font-semibold text-slate-700">{location.state?.email || "your email"}</span>
          </p>

          <form className="grid gap-5 py-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label htmlFor="otp" className="text-sm font-medium text-slate-700">
                Verification code
              </label>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {data.map((element, index) => {
                  return (
                    <input
                      key={"otp" + index}
                      type="text"
                      id="otp"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      ref={(ref)=>{
                          inputRef.current[index] = ref
                          return ref
                      }}
                      value={data[index]}
                      onChange={(e)=>{
                          const value = e.target.value;
                          const newData = [...data];
                          newData[index] = value;
                          setData(newData)

                          if(value && index < 5){
                              inputRef.current[index+1]?.focus()
                          }
                      }}
                      maxLength="1"
                      autoFocus={index === 0}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white text-center text-lg font-semibold text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  );
                })}
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
              Verify OTP
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

export default OtpVertification;
