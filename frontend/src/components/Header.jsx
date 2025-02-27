import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import {DisplayPriceInRupees} from '../utils/DisplayPriceInRupees.js'
import { useGlobalContext } from "../provider/GlobalProvider.jsx";
import DisplayCartItem from "./DisplayCart_Item.jsx";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();

  const isSearchPage = location.pathname === "/search" ? true : false;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const params = useLocation();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const {totalPrice, totalItems} = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);


  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  }

  const handleMobileUser = () =>{
    if(!user._id){
      navigate("/login");
      return
    }
    navigate("/user");
  }

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white container">
      {!(isSearchPage && isMobile) && (
        <div className="container max-auto flex items-center  px-2 justify-between">
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/*Search*/}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/*Login and my cart*/}
          <div className="">
            {/*user icon display only in mobile version*/}
            <button className="text-neutral-600 lg:hidden" onClick={handleMobileUser}>
              <FaRegCircleUser size={26} />
            </button>

            {/*Login and my cart display only in desktop version*/}
            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu}/>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="text-lg px-2 cursor-pointer "
                >
                  {" "}
                  Login{" "}
                </button>
              )}
              <button onClick={()=>setOpenCartSection(true)} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-3 py-2 rounded text-white">
                <div className="animate-bounce">
                  <BsCart4 size={26} />
                </div>

                <div className="font-semibold text-sm">
                  {
                    cartItem.length > 0 ? (
                      <div>
                        <p> {totalItems} Items</p>
                        <p> {DisplayPriceInRupees(totalPrice)}</p>
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )
                  }
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container max-auto px-2 lg:hidden">
        <Search />
      </div>
      {
        openCartSection && (
          <DisplayCartItem close={()=>setOpenCartSection(false)}/>
        )
      }
    </header>
  );
};

export default Header;
