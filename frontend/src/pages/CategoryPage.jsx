import { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const CategoryPage = () => {
    const[openUploadCategory, setOpenUploadCategory] = useState(false)
    const[loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit,setOpenEdit] = useState(false)
    const[editData,setEditData] = useState({
        name : "",
        image : ""
    })

    // const allCategory = useSelector(state => state.product.allCategory)

    // useEffect(()=>{
    //     setCategoryData(allCategory)
    // },allCategory)

    const[openConfirmBoxDelete,setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })

    const fetchCategory = async() => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
            

        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

    const handleDeleteCategory = async() => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
                AxiosToastError(error)
        }
    }

  return (
    <section className="w-full">
        <div className='p-4 bg-white shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-t-2xl'>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
                <h2 className='mt-2 text-xl font-semibold text-slate-900'>Category</h2>
            </div>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm border-emerald-200 text-emerald-700 border hover:bg-emerald-50 px-4 py-2 rounded-full cursor-pointer font-semibold'>Add Category</button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }

        <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
        {
            categoryData.map((category, index)=>{
                return (
                    <div key={category._id || index} className='rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 flex flex-col gap-3'>
                        <div className='aspect-square rounded-xl bg-emerald-50 p-3'>
                            <img
                            alt={category.name}
                            src={category.image}
                            className='h-full w-full object-contain'
                            />
                        </div>
                        <p className='text-sm font-semibold text-slate-800 line-clamp-2 min-h-[36px]'>
                            {category.name}
                        </p>
                        <div className='items-center flex gap-2'>
                            <button onClick={()=>{setOpenEdit(true)
                                setEditData(category)}
                             } className='flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-2 rounded-lg text-sm'> 
                                Edit
                            </button>
                            <button onClick={()=>{
                                setOpenConfirmBoxDelete(true)
                                setDeleteCategory(category)  

                            }} className='flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold py-2 rounded-lg text-sm'>
                                Delete
                            </button>
                        </div>
                    </div>
                    
                )
            })
        }
        </div>

        {
            loading && (
                <Loading/>
            )
        }

        
        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }
        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory}/>
            )
        }

        {
            openConfirmBoxDelete && (
                <ConfirmBox close={()=>setOpenConfirmBoxDelete(false)} cancel={()=>setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
            )
        }

    </section>
  )
}

export default CategoryPage