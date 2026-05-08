import { useState } from "react";
import { useSelector } from "react-redux";
import Add_Address from '../components/Add_Address'
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const[openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const {fetchAddress} = useGlobalContext()
  
  const handleDisableAddress = async(id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data : {
          _id : id
        }
      })

      if(response.data.success){
        toast.success("Address removed successfully")
        if(fetchAddress){
          fetchAddress()
        }
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <div className="w-full">
      <div className="bg-white shadow-sm px-4 py-4 flex flex-wrap justify-between items-center gap-4 rounded-t-2xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900 text-ellipsis line-clamp-1">Address</h2>
        </div>
        <button onClick={()=>setOpenAddress(true)} className="border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-50 cursor-pointer font-semibold">
          Add Address
        </button>
      </div>
      <div className="bg-slate-50 p-4 grid gap-4 rounded-b-2xl">
      {
        addressList.map((address, index) => {
          return (
              <div className={`border rounded p-3 flex gap-3 bg-white ${!address.status && 'hidden'}`} key={index+"addressPage"}>
                <div className="w-full">
                  <p>{address.address_line}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>{address.country} - {address.pinCode}</p>
                  <p>{address.mobile}</p>
                </div>
                <div className="grid gap-14">
                  <button onClick={()=>{ 
                    setOpenEdit(true)
                    setEditData(address)
                  } } className="cursor-pointer bg-green-200 p-1 rounded hover:text-white hover:bg-green-600 ">
                  <MdEdit size={20} />
                  </button>
                  <button onClick={()=>handleDisableAddress(address._id)} className="cursor-pointer bg-red-200 p-1 rounded hover:text-white hover:bg-red-600">
                  <MdDelete size={20}/>
                  </button>
                </div>
              </div>
          );
        })}
        {/* <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 cursor-pointer border-dashed flex justify-center items-center"
        >
          Add address
        </div> */}
      </div>
      {
        openAddress && (
          <Add_Address close={()=>setOpenAddress(false)}/>
        )
      }

      {
        openEdit && (
          <EditAddressDetails close={()=>setOpenEdit(false)} data={editData}/>
        )
      }
    </div>
  );
};

export default Address;
