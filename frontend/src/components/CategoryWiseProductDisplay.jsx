import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import AxiosToastError from "../utils/AxiosToastError" 
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";



    const CategoryWiseProductDisplay = ({id,name}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const containerRef = useRef()
    const SubCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data : {
                    id : id
                }
            })

            const { data : responseData } = response
            if(responseData.success) {
                setData(responseData.data)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategoryWiseProduct()
    },[])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListPage = () => {
        const subcategory = SubCategoryData.find(sub => sub.category.some(c => c._id === id));
    
        if (!subcategory) {
            // console.warn("No subcategory found for ID:", id);
            return "/";
        }
    
        const subcategoryName = subcategory.name ? validURLConvert(subcategory.name) : "unknown";
        const subcategoryId = subcategory._id ? subcategory._id : "unknown";
    
        return `/${validURLConvert(name)}-${id}/${subcategoryName}-${subcategoryId}`;
    };
    

  return (
    <div>
        <div className='container mx-auto p-4 flex items-center justify-between gap-4 '>
          <h3 className='font-semibold text-lg md:text-x'>{name}</h3>
          <Link to={handleRedirectProductListPage()} className='text-green-600 hover:text-green-400'>See All</Link>
        </div>
        <div className="relative flex items-center">
            <div className="flex  gap-4 md:gap-6 lg:gap-12 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth" ref={containerRef}>
                { loading && 
                loadingCardNumber.map((_,index)=>{
                    return (
                        <CardLoading  key={"CategoryWiseProductDisplay123"+index} />
                    )
                })
                }

                {
                data.map((p,index)=>{
                    return (
                        <CardProduct key={p._id+"CategoryWiseProductDisplay"+index} data={p} />
                    )
                })
                }
                

            </div>
            <div className="w-full absolute hidden lg:flex justify-between max-w-full left-0 right-0 container mx-auto px-2">
                <button onClick={handleScrollLeft} className="z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg">
                    <FaAngleLeft/>
                </button>
                <button onClick={handleScrollRight} className="z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg">
                    <FaAngleRight/>
                </button>
                </div>
        </div>
    </div>
    )
}

export default CategoryWiseProductDisplay