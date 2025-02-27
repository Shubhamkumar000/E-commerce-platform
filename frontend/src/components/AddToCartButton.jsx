import toast from "react-hot-toast";
import SummaryApi from "../common/SummaryApi";
import { useGlobalContext } from "../provider/GlobalProvider";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { fetchCartItems, updateCartItems, deleteCartItem } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemsDetails, setCartItemsDetails] = useState();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItems) {
          fetchCartItems();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkingItem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingItem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQuantity(product?.quantity);
    setCartItemsDetails(product)
  }, [cartItem, data]);

  const increaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const response = await updateCartItems(cartItemsDetails?._id, cartItemsDetails.quantity + 1)

    if(response.success){
      toast.success("Item added to cart")
    }

  };

  const decreaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(quantity == 1){
        deleteCartItem(cartItemsDetails._id)
    } else {
      const response = await updateCartItems(cartItemsDetails?._id, cartItemsDetails.quantity - 1)

      if(response.success){
        toast.success("Item removed from cart")
      }
    }

  };

  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQuantity}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaMinus />
          </button>
          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">{quantity}</p>
          <button
            onClick={increaseQuantity}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? <Loading /> : "Add"}
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
