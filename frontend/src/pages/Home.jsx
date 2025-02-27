import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { validURLConvert } from '../utils/validURLConvert.js'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay.jsx'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const SubCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListPage = (id,cat) => {
    const subcategory = SubCategoryData.find(sub => {
      return sub.category.some(c => c._id === id);
    });


    const url = `/${validURLConvert(cat)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);

  }



  return (
    <section className='bg-white'>
      <div className="container mx-auto rounded">
        <div className={`w-full h-full min-h-48  bg-blue-100 rounded ${!banner && "animate-pulse my-2 "}`}>
          <img
          src={banner}
          alt='Banner'
          className='w-full h-full hidden lg:block'
          />
          <img
          src={bannerMobile}
          alt='Banner'
          className='w-full h-full block lg:hidden'
          />
        </div>
      </div>

      {/*Category Part Display*/}
      <div className='container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2'>
        {
          loadingCategory ? (
            new Array(12).fill(null).map((c,index)=>{
              return (
                <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-200 min-h-24 rounded'></div>
                  <div className='bg-blue-200 h-8 rounded'></div>
                </div>
              )
            })
          ) : (
            categoryData.map((c,index)=>{
              return (
                <div key={c._id+"displayCategory"} className='w-full h-full' onClick={()=>handleRedirectProductListPage(c._id,c.name)}>
                  <div>
                      <img
                      src={c.image}
                      className='w-full h-full object-scale-down'
                      />
                  </div>
                </div>
              )
            })
          )
          
        }
      </div>


      {/*display category product*/}
      {
        categoryData.map((c,index)=>{
          return (
            <CategoryWiseProductDisplay key={c._id + "CategoryWiseProduct"} id={c?._id} name={c?.name}/>
          )
        })
      }


    </section>
    
  )
}

export default Home