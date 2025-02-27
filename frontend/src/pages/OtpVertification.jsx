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
    <section className="w-full container max-auto p-7">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4">
        <p className="font-semibold text-lg mb-2">Enter OTP</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp">Enter your OTP </label>
            <div className="flex items-center justify-between mt-3">
              {data.map((element, index) => {
                return (
                  <input
                  key={"otp"+index}
                    type="text"
                    id="otp"
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
                    autoFocus
                    className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none
                     focus:border-primary-200 text-center font-semibold"
                  />
                );
              })}
            </div>
          </div>
          <button
            disabled={!validateValue}
            className={`${
              validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } bg-gray-500 text-white p-2 rounded font-semibold my-3 tracking-wide cursor-pointer`}
          >
            Verify OTP
          </button>
        </form>
        <p>
          Already have account?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVertification;
