import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useEffect, useRef, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/best_prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { PricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(0);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <section className="container mx-auto p-4 grid lg:grid-cols-2 ">
      {/*Left Part*/}
      <div className="">
        <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] min-h-56 max-h-56 rounded h-full w-full">
          <img
            src={data.image[image]}
            className="w-full h-full object-scale-down"
          />
        </div>
        <div className="flex items-center justify-center gap-3 my-2">
          {data.image.map((img, index) => {
            return (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 lg:w-5 lg:h-5 w-3 h-3 rounded-full
                                ${index === image && "bg-slate-400"} }
                            `}
              ></div>
            );
          })}
        </div>
        <div className="grid relative">
          <div
            ref={imageContainer}
            className="flex gap-4 relative z-10 w-full overflow-x-auto scrollbar-none"
          >
            {data.image.map((img, index) => {
              return (
                <div
                  className="w-20 h-20 min-h-20 min-w-20  shadow-md cursor-pointer"
                  key={img + index}
                >
                  <img
                    src={img}
                    alt="min-product"
                    onClick={() => setImage(index)}
                    className="w-full h-full object-scale-down"
                  />
                </div>
              );
            })}
          </div>
          <div className="absolute w-full lg:flex hidden justify-between h-full -ml-3 items-center">
            <button
              onClick={handleScrollLeft}
              className="z-10 bg-white p-1 rounded-full shadow-lg relative"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 bg-white p-1 rounded-full shadow-lg relative"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div className="my-4 hidden lg:grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p className="">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="">{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data.more_details).map((element,index)=>{
              return (
                <div key={index+"more_details"}>
                  <p className="font-semibold">{element}</p>
                  <p className="">{data?.more_details[element]}</p>
              </div>
              )
            })
          }
        </div>
      </div>

      {/*Right Part*/}
      <div className="p-4 lg:pl-7 text-base lg:text-lg">
        <p className="bg-green-400 w-fit px-2 rounded-full">10 Min</p>
        <h2 className="font-semibold lg:text-3xl">{data.name}</h2>
        <p className="">{data.unit}</p>
        <Divider />
        <div>
          <p className="">Price</p>
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
              <p className="font-semibold text-lg lg:text-xl">
                {DisplayPriceInRupees(PricewithDiscount(data.price, data.discount))}
              </p>
            </div>
            {
              data.discount && (
                <p className="line-through">{DisplayPriceInRupees(data.price)}</p>
              )
            }
              {
              data.discount && (
                <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className="text-base text-neutral-500">Discount</span></p>
              )
              }
          </div>
        </div>
        {
          data.stock === 0 ? (
            <p className="text-lg text-red-500 my-2">Out of Stock</p>
          ) : (
            // <button className="my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded">
            //   Add
            // </button>
            <div className="my-4">
              <AddToCartButton data={data}/>
            </div>
          )
        }


        <h2 className="font-semibold">Why shop from Blinkit?</h2>
        <div>
          <div className="flex items-center gap-4 py-4">
            <img
              src={image1}
              alt="superfast delivery"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Superfast delivery</div>
              <p>
                Get your order delivered to your doorstep quickly from nearby
                dark stores.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4">
            <img
              src={image2}
              alt="Best prices offers"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Best Prices & Offers</div>
              <p>
                Your go-to destination for the best prices and exclusive offers,
                directly from manufacturers.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4">
            <img
              src={image3}
              alt="Wide Assortment"
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <div className="text-sm">
              <div className="font-semibold">Wide Assortment</div>
              <p>
                Choose from 5,000+ products across food, personal care,
                household essentials, and more.
              </p>
            </div>
          </div>
        </div>


        {/*only mobile */}
        <div className="my-4 grid gap-3 md:hidden">
          <div>
            <p className="font-semibold">Description</p>
            <p className="">{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p className="">{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data.more_details).map((element,index)=>{
              return (
                <div key={index+"more_details"}>
                  <p className="font-semibold">{element}</p>
                  <p className="">{data?.more_details[element]}</p>
              </div>
              )
            })
          }
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
