import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../Store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector((state) => state.user);
    const[openProfileAvatarEdit, setOpenProfileAvatarEdit] = useState(false)
    const[userData,setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile
    })
    const[loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile
        })
    },[user])

    const handleOnChange = (e) => {
        const {name,value} = e.target
        setUserData((prev)=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const {data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails();
                dispatch(setUserDetails(userData.data));
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='w-full'>
        <div className="bg-white shadow-sm px-4 py-4 flex flex-wrap justify-between items-center gap-4 rounded-t-2xl">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">Profile</h2>
            </div>
        </div>

        <div className="p-6 bg-white rounded-b-2xl">
            {/*profile upload and display image*/}
            <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                {
                    user.avatar ? (
                        <img
                        alt={user.name}
                        src={user.avatar}
                        className='w-full h-full '
                        />
                    ) : (
                        <FaRegUserCircle size={65}/>
                    )
                }
            </div>
            <button onClick={()=> setOpenProfileAvatarEdit(true)} className='text-xs min-w-20 border px-3 py-1 rounded-full mt-3 cursor-pointer border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
            Edit
            </button>
            {
                openProfileAvatarEdit && (
                    <UserProfileAvatarEdit close={()=>setOpenProfileAvatarEdit(false)}/>
                )
            }

            {/*name,mobile,email,change password*/}
            <form className='my-6 grid gap-4 max-w-xl' onSubmit={handleSubmit}>
               <div className='grid'>
                <label htmlFor='name'>Name</label>
                    <input
                    type="text"
                    id='name'
                    placeholder="Enter your name"
                    className='p-2 bg-slate-50 outline-none border border-slate-200 focus-within:border-emerald-300 rounded-lg'
                    value={userData.name}
                    name="name"
                    onChange={handleOnChange}
                    required
                    />
               </div>
               <div className='grid'>
                <label htmlFor='email'>Email</label>
                    <input
                    type="text"
                    id="email"
                    placeholder="Enter your email"
                    className='p-2 bg-slate-50 outline-none border border-slate-200 focus-within:border-emerald-300 rounded-lg'
                    value={userData.email}
                    name="email"
                    onChange={handleOnChange}
                    required
                    />
               </div>
               <div className='grid'>
                <label htmlFor='mobile'>Mobile</label>
                    <input
                    type="text"
                    id="mobile"
                    placeholder="Enter your mobile"
                    className='p-2 bg-slate-50 outline-none border border-slate-200 focus-within:border-emerald-300 rounded-lg'
                    value={userData.mobile}
                    name="email"
                    onChange={handleOnChange}
                    required
                    />
               </div>
               <button className='border px-4 py-2 font-semibold border-emerald-200 rounded-full hover:bg-emerald-50 text-emerald-700 cursor-pointer'>
                    {
                        loading ? "Loading..." : "Update"
                    }
               </button>
            </form>
        </div>
    </div>
  )
}

export default Profile