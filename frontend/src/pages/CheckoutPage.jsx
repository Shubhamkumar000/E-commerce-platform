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
    <section className="bg-gradient-to-b from-emerald-50 via-white to-amber-50/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="w-full">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Checkout</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">Choose your address</h3>
                </div>
                <button
                  onClick={() => setOpenAddress(true)}
                  className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Add new address
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                {addressList.map((address, index) => {
                  const isSelected = Number(selectedAddress) === index;
                  return (
                    <label
                      key={address?._id || index}
                      htmlFor={"address" + index}
                      className={`${!address.status ? "hidden" : ""}`}
                    >
                      <div
                        className={`flex gap-3 rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-emerald-300 bg-emerald-50/60"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="pt-1">
                          <input
                            type="radio"
                            id={"address" + index}
                            value={index}
                            name="address"
                            checked={isSelected}
                            onChange={(e) => setSelectedAddress(Number(e.target.value))}
                          />
                        </div>
                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-slate-900">{address.address_line}</p>
                          <p>{address.city}</p>
                          <p>{address.state}</p>
                          <p>
                            {address.country} - {address.pinCode}
                          </p>
                          <p>{address.mobile}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
                <button
                  onClick={() => setOpenAddress(true)}
                  className="flex h-16 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Add address
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:sticky lg:top-24">
              <h3 className="text-xl font-semibold text-slate-900">Summary</h3>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-900">Bill Details</h4>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <p>Items total</p>
                    <p className="flex items-center gap-2">
                      <span className="line-through text-neutral-400">
                        {DisplayPriceInRupees(noDiscountTotalPrice)}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {DisplayPriceInRupees(totalPrice)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Total Quantity</p>
                    <p>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Delivery Charge</p>
                    <p>Free</p>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                    <p>Grand Total</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleOnlinePayment}
                  className="rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700"
                >
                  Online Payment
                </button>
                <button
                  onClick={handleCashOnDelivery}
                  className="rounded-full border-2 border-emerald-600 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Cash on delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openAddress && <Add_Address close={() => setOpenAddress(false)} />}
    </section>
  );
};
