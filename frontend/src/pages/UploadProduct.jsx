import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToasterror from '../utils/AxiosToastError';
import successAlert from "../utils/successAlert";




const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [loading, setLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const[selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName,setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0];

    if(!file) {
      return;
    }
    setLoading(true);
    const response = await uploadImage(file);
    const {data : ImagResponse} = response;
    const imageUrl = ImagResponse.data.url;

    setData((prev)=>{
      return {
        ...prev,
        image : [...prev.image,imageUrl]
      }
    })
    setLoading(false);
  }

  const handleDeleteImage = async(index)=>{
    setData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  }

  const handleRemoveCategory = async(index)=>{
    setData((prev)=> ({
      ...prev,
      category : prev.category.filter((_,i)=>i !== index) 
    }));
  }

  const handleRemoveSubCategory = async(index)=>{
    setData((prev)=> ({
      ...prev,
      subCategory : prev.subCategory.filter((_,i)=>i !== index) 
    }));
  }

  const handleAddField = async()=>{
    setData((prev)=>{
      return {
        ...prev,
        more_details : {
          ...prev.more_details,
          [fieldName] : ""
        }
      }
    })
    setFieldName("");
    setOpenAddField(false);
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data : data
      })
      const { data : responseData } = response;
      if(responseData.success){
        successAlert(responseData.message);
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        })
      }
    } catch (error) {
      AxiosToasterror(error);
    }
  }

//  useEffect(()=>{
//     successAlert("Upload successfully")
//   },[])

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div className="grid p-4">
        <form className="grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter product name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              placeholder="Enter product description"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              rows={3}
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
            />
          </div>
          <div>
            <p>Image</p>
            <div>
              <label className="bg-blue-50 h-24 border rounded flex items-center justify-center cursor-pointer">
                <div className="text-center flex justify-center items-center flex-col">
                  {
                    loading ? <Loading/> : (
                      <>
                      <FaCloudUploadAlt size={35} />
                      <p>Upload Image</p>
                      </>
                    )
                  }
                  
                </div>
                <input
                  type='file'
                  className="hidden"
                  accept='image/*'
                  onChange={handleUploadImage}
                />
              </label>
              {/**display uploaded Image*/}
              <div className="flex flex-wrap gap-4">
                {
                  data.image.map((img,index)=>{
                    return (
                      <div key={img+index} className="h-20 w-20 mt-1 min-w-20 bg-blue-50 border relative group">
                        <img
                        src ={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={()=>setViewImageURL(img)}
                        />
                        <div onClick={()=>handleDeleteImage(index)} className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block">
                          <MdDelete size={20} className="cursor-pointer"/>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label>Category</label>
                <div>
                  <select className="bg-blue-50 border w-full p-2 rounded"
                    value={selectCategory}
                    onChange={(e)=>{
                      const value = e.target.value;
                      const category = allCategory.find(el => el._id === value);

                      setData((prev)=>{
                        return {
                          ...prev,
                          category : [...prev.category,category]

                        }
                      })
                      setSelectCategory("");
                    }}
                    >
                    <option value="">Select Category</option>
                    {
                      allCategory.map((c,index)=>{
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {
                      data.category.map((c,index)=>{
                        return (
                          <div key={c._id+index+"productsection"} className="text-sm flex items-center gap-1 bg-blue-50 mt-1">
                            <p>{c.name}</p>
                            <div className="hover:text-red-500 cursor-pointer" onClick={()=>handleRemoveCategory(index)}>
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
          </div>
          <div className="grid gap-1">
            <label>Sub Category</label>
                <div>
                  <select className="bg-blue-50 border w-full p-2 rounded"
                    value={selectSubCategory}
                    onChange={(e)=>{
                      const value = e.target.value;
                      const subCategory = allSubCategory.find(el => el._id === value);

                      setData((prev)=>{
                        return {
                          ...prev,
                          subCategory : [...prev.subCategory,subCategory]

                        }
                      })
                      setSelectSubCategory("");
                    }}
                    >
                    <option value="">Select Sub Category</option>
                    {
                      allSubCategory.map((c,index)=>{  
                        return (
                          <option value={c?._id}>{c.name}</option>
                        )
                      })
                    }
                  </select>
                  <div className="flex flex-wrap gap-3">
                    {
                      data.subCategory.map((c,index)=>{
                        return (
                          <div key={c._id+index+"productsection"} className="text-sm flex items-center gap-1 bg-blue-50 mt-1">
                            <p>{c.name}</p>
                            <div className="hover:text-red-500 cursor-pointer" onClick={()=>handleRemoveSubCategory(index)}>
                              <IoClose size={20}/>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              placeholder="Enter product unit"
              name="unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="stock">Number of Stock</label>
            <input
              type="number"
              id="stock"
              placeholder="Enter product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              placeholder="Enter product price"
              name="price"
              value={data.price}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded appearance-none"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount">Discount</label>
            <input
              type="number"
              id="discount"
              placeholder="Enter product discount"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded appearance-none"
            />
          </div>

          {/* add more field */}
          <div>
            {
              Object?.keys(data.more_details)?.map((key,index)=>{
                return (
                    <div className="grid gap-1">
                      <label htmlFor={key}>{key}</label>
                      <input
                        type="text"
                        id={key}
                        value={data?.more_details[key]}
                        onChange={(e)=>{
                          const value = e.target.value;
                          setData((prev)=>{
                            return {
                              ...prev,
                              more_details : {
                                ...prev.more_details,
                                [key] : value
                              }
                            }
                          })
                        }}
                        required
                        className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded appearance-none"
                      />
                    </div>
                )
              })
            }
          </div>

          <div onClick={()=>setOpenAddField(true)} className="hover:bg-primary-200 bg-white py-1 px-3 w-26 font-semibold border
          border-primary-200 hover:text-neutral-900 cursor-pointer rounded"  >
            Add Fields
          </div>
          <button className="bg-parimary-100 hover:bg-primary-200 border py-2 rounded font-semibold">
          Submit
          </button>
          
        </form>
      </div>
      {
        ViewImageURL && (
          <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
        )
      }
      {
        openAddField && (
          <AddFieldComponent
          value={fieldName}
          onChange={(e)=>setFieldName(e.target.value)}
          submit={handleAddField}
          close={()=>setOpenAddField(false)}
          />
        )
      }
    </section>
  );
};

export default UploadProduct;
