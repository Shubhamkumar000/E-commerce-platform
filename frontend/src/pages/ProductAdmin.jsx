import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin';
import { IoSearchOutline } from "react-icons/io5";



const ProductAdmin = () => {
  const[productData, setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(0)
  const [search, setSearch] = useState('')

  const fetchProductData = async() => {
    try {
        setLoading(true)
        const response = await Axios({
            ...SummaryApi.getProduct,
            data : {
                page : page,
                limit : 12,
                search : search
            }
        })
        const { data : responseData } = response

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
        }

    } catch (error) {
        AxiosToastError(error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
    let flag = true
    const interval = setTimeout(()=>{
      if(flag) {
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>clearTimeout(interval)
  },[page, search])

  const handleNext = () => {
    if(page !== totalPageCount ) {
      setPage(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if(page > 1) {
      setPage(prev => prev - 1)
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setPage(1)
    setSearch(value)
  }

  return (
    <section className="w-full">
      <div className="p-4 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4 rounded-t-2xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Product</h2>
          </div>
          <div className='h-full min-w-[220px] ml-auto max-w-80 w-full bg-slate-50 px-4 flex items-center gap-3 py-2 border border-slate-200 rounded-full focus-within:border-emerald-300'>
            <IoSearchOutline size={20}/>
            <input
              type='text'
              placeholder='Search Product...'
              className='h-full outline-none w-full bg-transparent'
              value={search}
              onChange={handleOnChange}
            />
          </div>
      </div>
      {
        loading && (
          <Loading/>
        )
      }
      <div className='p-4 bg-slate-50 rounded-b-2xl'>
        <div className='min-h-[50vh]'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4'>
            {
              productData.map((product,index)=>{
                return (
                  <ProductCardAdmin key={product?._id || index} data={product} fetchProductData={fetchProductData}/>
                )
              })
            }
          </div>
        </div>

         <div className='flex flex-wrap items-center gap-3 my-4'>
          <button onClick={handlePrevious} className='border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 cursor-pointer' >Previous</button>
          <button className='flex-1 bg-white rounded-full py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-emerald-200 px-4 py-2 rounded-full hover:bg-emerald-50 cursor-pointer' >Next</button>
        </div>
      </div>

      
    </section>
  )
}

export default ProductAdmin