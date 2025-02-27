import { Link } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validURLConvert } from "../utils/validURLConvert";
import { PricewithDiscount } from "../utils/PriceWithDiscount";
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useState } from "react";
import toast from "react-hot-toast";
import Axios from '../utils/Axios';
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";



const CardProduct = ({ data }) => {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;
  
  return (
    <Link
      to={url}
      className="border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded bg-white"
    >
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        <img
          src={data.image[0]}
          className="w-full h-full object-scale-down lg:scale-125 "
        />
      </div>
      <div className="flex items-center gap-1">
        <div className=" rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50">
          10 min
        </div>
        <div>
          {Boolean(data.discount) && (
            <p className="text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full">
              {data.discount}% discount
            </p>
          )}
        </div>
      </div>
      <div className="px-2 lg:px-0 font-medium text-ellipsis lg:text-base text-sm line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit px-2 lg:text-base text-sm lg:px-0 gap-1 ">
        {data.unit}
      </div>

      <div className="px-2 flex items-center justify-between gap-1 lg:gap-3 lg:text-base text-sm lg:px-0">
        <div className="font-semibold">
          {DisplayPriceInRupees(PricewithDiscount(data.price, data.discount))}
        </div>
        <div className="">
          {
            data.stock === 0 ? (
              <p className="text-red-500 text-sm text-center">Out of Stock</p>
            ) : (
              <AddToCartButton data={data} />
            )
          }
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
