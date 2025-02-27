import { createContext, useContext, useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../Store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { PricewithDiscount } from "../utils/PriceWithDiscount";
import { setAddressList } from "../Store/addressSlice";
import { setOrders} from '../Store/orderSlice';

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [noDiscountTotalPrice, setNoDiscountTotalPrice] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const fetchCartItems = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCartItems,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCartItems = async (id, quantity) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItems,
        data: {
          _id: id,
          quantity: quantity,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItems();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const reponse = await Axios({
        ...SummaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });

      const { data: responseData } = reponse;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItems();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    
    const Items = cartItem.reduce((prev, current) => {
      return prev + current.quantity;
    }, 0);
    setTotalItems(Items);

    const Price = cartItem.reduce((prev, current) => {
      const priceAfterDiscount = PricewithDiscount(
        current?.productId?.price,
        current?.productId?.discount
      );

      return prev + priceAfterDiscount * current.quantity;
    }, 0);

    const noDiscountPrice = cartItem.reduce((prev, current) => {
      return prev + current?.productId?.price * current.quantity;
    }, 0);
    setNoDiscountTotalPrice(noDiscountPrice);

    setTotalPrice(Price);
  }, [cartItem]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  }

  const fetchAddress = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.getAddress
      });

      const { data : responseData } = response;

      if(responseData.success){
        dispatch(setAddressList(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const fetchOrder = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.getOrderList
      })
      const { data : responseData } = response;
      if(responseData.success){
        console.log(responseData.data)
        dispatch(setOrders(responseData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchCartItems();
    handleLogout()
    fetchAddress()
    fetchOrder()
  },[user])


  return (
    <GlobalContext.Provider
      value={{
        fetchCartItems,
        updateCartItems,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        totalItems,
        totalPrice,
        noDiscountTotalPrice
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
