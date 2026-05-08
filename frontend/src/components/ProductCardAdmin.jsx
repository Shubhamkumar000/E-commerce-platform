import React, { useState } from 'react'
import EditProductAdmin from '../components/EditProductAdmin'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'


const ProductCardAdmin = ({data , fetchProductData}) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data : {
          _id : data?._id
        }
      })
      const { data : responseData} = response

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 flex flex-col gap-3 h-full'>
      <div className='aspect-square rounded-xl bg-emerald-50 p-3'>
        <img
        src={data?.image[0]}
        alt={data?.name}
        className='h-full w-full object-contain'
        />
      </div>
      <div className='min-h-[56px]'>
        <p className='text-ellipsis line-clamp-2 font-semibold text-slate-900'>{data?.name}</p>
        <p className='text-xs text-slate-500'>{data?.unit}</p>
      </div>
      <div className='grid grid-cols-2 gap-2 mt-auto'>
        <button onClick={()=>setEditOpen(true)}className='border px-2 py-2 text-sm border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold'>Edit</button>
        <button onClick={()=>setOpenDelete(true)} className='border px-2 py-2 text-sm border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg font-semibold'>Delete</button>
      </div>
      {
        editOpen && (
          <EditProductAdmin data={data} close={()=>setEditOpen(false)} fetchProductData={fetchProductData}/>
        )
      }
      {
        openDelete && (
          <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-800/70 z-50 p-4 flex items-center justify-center'>
            <div className='bg-white p-4 w-full max-w-md rounded-md'>
                <div className='flex justify-between items-center gap-4'>
                  <h3 className='font-semibold'>Permanent delete</h3>
                  <button onClick={()=>setOpenDelete(false)}>
                    <IoClose size={25}/>
                  </button>
                </div>
                <p className='my-2'>Are you sure want to delete permanently?</p>
                <div className='flex justify-end gap-5 py-4'>
                  <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Cancel</button>
                  <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Delete</button>
                </div>
            </div>
          </section>
        )
      }
    </div>
  )
}

export default ProductCardAdmin