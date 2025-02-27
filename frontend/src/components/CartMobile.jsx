import { FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CartMobile = () => {                        //this component is about the bottom cart section in mobile view
  const { totalPrice, totalItems } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  return (
    <>
      {cartItem[0] && (
        <div className="sticky bottom-4 p-2">
          <div className="px-2 py-1 bg-green-700 rounded text-neutral-100 text-sm lg:hidden flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded w-fit">
                <FaCartShopping />
              </div>
              <div className="text-sx">
                <p>{totalItems} items</p>
                <p>{DisplayPriceInRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to={"/cart"} className="flex items-center gap-1">
              <span>View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobile;
