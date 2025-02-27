import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import { useState } from "react";
import Add_Address from "../components/Add_Address";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

export const CheckoutPage = () => {
  const { noDiscountTotalPrice, totalPrice, totalItems,fetchCartItems,fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();


  const handleCashOnDelivery = async() => {

    try {
        const response = await Axios({
            ...SummaryApi.cashOnDelivery,
            data : {
                list_items : cartItemsList,
                totalAmt : totalPrice,
                addressId : addressList[selectedAddress]?._id,
                subTotalAmt : totalPrice
            }
        })

        const {data : responseData} = response;

        if(responseData.success) {
            toast.success(responseData.message)
            if(fetchCartItems) {
                fetchCartItems()
            }
            if(fetchOrder){
                fetchOrder()
            }
            navigate('/success',{
                state : {
                    text : "Order"
                }
            })
        }
    } catch (error) {
        AxiosToastError(error)
    }
  };

  const handleOnlinePayment = async() => {
    try {
        toast.loading("Redirecting to payment gateway")
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)

        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
                list_items : cartItemsList,
                totalAmt : totalPrice,
                addressId : addressList[selectedAddress]?._id,
                subTotalAmt : totalPrice
            }
        })
        const { data : responseData } = response

        stripePromise.redirectToCheckout({sessionId : responseData.id})

    } catch (error) {
        AxiosToastError(error)
    }
  }

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-5 justify-between">
        <div className="w-full">
          {/*address*/}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  htmlFor={"address" + index}
                  className={!address.status && "hidden"}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        type="radio"
                        id={"address" + index}
                        value={index}
                        name="address"
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pinCode}{" "}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 cursor-pointer border-dashed flex justify-center items-center"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/*summary*/}
          <h3 className="text-lg font-semibold ">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill Details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(noDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Total Quantity</p>
              <p className="flex items-center gap-2">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4 ml-1">
              <p>Grand Total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full ">
            <button onClick={handleOnlinePayment} className="px-2 py-4 bg-green-600 hover:bg-green-700 rounded font-semibold text-white cursor-pointer">
              Online Payment
            </button>
            <button onClick={handleCashOnDelivery} className="px-2 py-4 border-2 border-green-600 font-semibold text-green-600 cursor-pointer hover:text-white hover:bg-green-600">
              Cash on delivery
            </button>
          </div>
        </div>
      </div>
      {openAddress && <Add_Address close={() => setOpenAddress(false)} />}
    </section>
  );
};
