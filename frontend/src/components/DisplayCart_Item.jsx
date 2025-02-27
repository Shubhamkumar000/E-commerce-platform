import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from '../components/AddToCartButton'
import { PricewithDiscount } from "../utils/PriceWithDiscount";
import EmptyImage from '../assets/empty_cart.webp'
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { noDiscountTotalPrice, totalPrice, totalItems} = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if(user._id) {
        navigate("/checkout");
        if(close){
            close();
        }
        return;
    }
    toast("Please login")
  }


  return (
    <section className="bg-neutral-900/70 fixed top-0 bottom-0 right-0 left-0 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="cursor-pointer hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] max-h-[calc(100vh-150px)] h-full bg-blue-50 p-2 flex flex-col gap-4 ">
          {/*display items*/}
          {
            cartItem.length  > 0 ? (
                <>
                <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 gap-2 rounded-full">
                    <div>Your Total Savings </div>
                    <p>{DisplayPriceInRupees(noDiscountTotalPrice - totalPrice)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                    {cartItem.length > 0 && cartItem.map((item, index) => {
                        return (
                            <div key={item._id +"cartItemDisplay"} className="flex w-full gap-4">
                                <div className="w-16 h-16 min-h-16 min-w-16 bg-red-500 border rounded">
                                    <img
                                    src={item?.productId?.image[0]}
                                    className="object-scale-down "
                                    />
                                </div>
                                <div className="w-full max-w-sm text-sm">
                                    <p className="text-sm text-ellipsis line-clamp-2">{item?.productId?.name}</p>
                                    <p className="text-neutral-500">{item?.productId?.unit}</p>
                                    <p className="font-semibold">{DisplayPriceInRupees(PricewithDiscount(item?.productId.price,item?.productId.discount))}</p>
                                </div>
                                <div>
                                    <AddToCartButton data={item?.productId}/>
                                </div>
                            </div>
                            
                        )
                    })}
                </div>
                <div className="bg-white p-4">
                    <h3 className="font-semibold">Bill Details</h3>
                    <div className="flex gap-4 justify-between ml-1">
                        <p>Items total</p>
                        <p className="flex items-center gap-2"><span className="line-through text-neutral-400">{DisplayPriceInRupees(noDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                    </div>
                    <div className="flex gap-4 justify-between ml-1">
                        <p>Total Quantity</p>
                        <p className="flex items-center gap-2">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
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
                </>
            ) : (
                <div className="bg-white flex flex-col justify-center items-center">
                    <img src={EmptyImage}
                    alt="empty-cart"
                    className="w-full h-full object-scale-down"
                    />
                    <Link onClick={close} to={'/'} className="bg-green-600 px-4 py-2 text-white rounded">Shop Now</Link>
                </div>
            )
          }
          
        </div>
          {
            cartItem.length > 0 && (
                <div className="p-2">
                    <div className="bg-green-700 text-neutral-100 px-4 py-4 font-bold sticky bottom-3 rounded flex items-center  gap-4 justify-between">
                        <div>{DisplayPriceInRupees(totalPrice)}</div>
                        <button onClick={redirectToCheckoutPage} className="flex items-center gap-1 cursor-pointer">
                        Proceed
                        <span>
                            <FaCaretRight />
                        </span>
                        </button>
                    </div>
                </div>
            )
          }
      </div>
    </section>
  );
};

export default DisplayCartItem;
