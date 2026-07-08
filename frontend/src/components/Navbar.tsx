import { useState } from "react";
import { assets } from "../assets/assets.js";
import { Link, NavLink } from "react-router-dom";
import { useProductStore } from "../stores/productStore.js";
import { useCartStore } from "../stores/cartStore.js";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { useShallow } from "zustand/shallow";
const Navbar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { setShowSearch } = useProductStore();
  const { getCartCount } = useCartStore();
  const { token, logout, sessionLoading } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      logout: state.logout,
      sessionLoading: state.sessionLoading,
    })),
  );
  const handelSearchIcon = () => {
    setShowSearch(true);
    navigate("/collection");
  };
  if (sessionLoading) return null;
  return (
    <div className=" flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo} alt="logo" className=" w-36" />
      </Link>

      <ul className=" hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className=" flex flex-col items-center gap-1 ">
          <p>HOME </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink
          to="/collection"
          className=" flex flex-col items-center gap-1 "
        >
          <p>COLLECTION </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className=" flex flex-col items-center gap-1 ">
          <p>ABOUT </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className=" flex flex-col items-center gap-1 ">
          <p>CONTACT </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
      <div className=" flex items-center gap-6">
        <img
          src={assets.search_icon}
          alt="search icon"
          className=" w-5 cursor-pointer"
          onClick={handelSearchIcon}
        />
        <div className=" group relative">
          <Link to={"/login"}>
            <img
              onClick={() => !token && navigate("/login")}
              src={assets.profile_icon}
              alt="profile icon"
              className=" w-5 cursor-pointer"
            />
          </Link>
          <div className=" drop-down-menu pt-4 hidden right-0 absolute group-hover:block">
            {!sessionLoading && token && (
              <div className=" flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded ">
                <p className=" cursor-pointer hover:text-black">My profile</p>
                <p
                  className=" cursor-pointer hover:text-black"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </p>
                <p
                  className=" cursor-pointer hover:text-black"
                  onClick={logout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
        <Link to="./cart" className=" relative">
          <img src={assets.cart_icon} alt="cart icon" className="w-5 min-w-5" />
          <p className=" absolute right-[-5px] bottom-[-5px] text-center bg-black w-4 leading-4 text-white rounded-full text-[8px] aspect-square">
            {getCartCount()}
          </p>
        </Link>
        <img
          src={assets.menu_icon}
          alt="menu icon"
          className=" w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(true)}
        />
      </div>
      {/* sidebar menu for small screen */}
      <div
        className={` absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : " w-0"
        }`}
      >
        <div className=" flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className=" flex items-center gap-4 p-3  "
          >
            <img
              className=" h-4 rotate-180 cursor-pointer"
              src={assets.dropdown_icon}
              alt="drop-down-menu"
            />
            <p className="cursor-pointer">Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-b"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-b"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-b"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-b"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
