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
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
          <h2 className="font-semibold">Product</h2>
          <div className='h-full min-w-24 ml-auto max-w-56 w-full bg-blue-50 px-4 flex items-center gap-3 py-2 border rounded focus-within:border-primary-200 '>
            <IoSearchOutline size={25}/>
            <input
              type='text'
              placeholder='Search Product...'
              className='h-full outline-none w-full '
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
      <div className='p-4 bg-blue-50'>
        <div className='min-h-[50vh]'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {
              productData.map((product,index)=>{
                return (
                  <ProductCardAdmin data={product} fetchProductData={fetchProductData}/>
                )
              })
            }
          </div>
        </div>

         <div className='flex justify-between my-4'>
          <button onClick={handlePrevious} className='border border-primary-200 px-4 py-1 hover:bg-primary-200 cursor-pointer' >Previous</button>
          <button className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
          <button onClick={handleNext} className='border border-primary-200 px-4 py-1 hover:bg-primary-200 cursor-pointer' >Next</button>
        </div>
      </div>

      
    </section>
  )
}

export default ProductAdmin