
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { useProductStore } from "../stores/productStore";
import { useShallow } from "zustand/shallow";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { to: "/", label: "HOME" },
  { to: "/collection", label: "COLLECTION" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const { getCartCount } = useCartStore();
  const { setShowSearch } = useProductStore();

  const { token, logout, sessionLoading } = useAuthStore(
    useShallow((state) => ({
      token: state.token,
      logout: state.logout,
      sessionLoading: state.sessionLoading,
    })),
  );

  // Subscribe to cart count changes

  const handleSearchIcon = () => {
    setShowSearch(true);
    navigate("/collection");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36" />
      </Link>

      {/* Desktop nav links */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center gap-1"
          >
            {({ isActive }) => (
              <>
                <p>{label}</p>
                <hr
                  className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${
                    isActive ? "block" : "hidden"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      {/* Right side icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <img
          src={assets.search_icon}
          alt="search"
          className="w-5 cursor-pointer"
          onClick={handleSearchIcon}
        />

        {/* Profile dropdown */}
        {!sessionLoading && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-5 cursor-pointer"
              />
            </DropdownMenuTrigger>
            {token ? (
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] text-center bg-black w-4 leading-4 text-white rounded-full text-[8px] aspect-square">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <img
              src={assets.menu_icon}
              alt="menu"
              className="w-5 cursor-pointer sm:hidden"
            />
          </SheetTrigger>

          <SheetContent className="w-64 p-0 ">
            <div className="grid flex-1 auto-rows-min  mt-12 w-64 ">
              {NAV_LINKS.map(({ to, label }) => (
                <SheetClose className="hover:bg-mist-100" asChild key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      ` grid p-2  text-left  ${
                        isActive
                          ? "bg-black text-white"
                          : "hover:bg-gray-50 hover:text-black"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </SheetClose>
              ))}
              {token ? (
                <>
                  <SheetClose className="hover:bg-mist-100" asChild>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `  grid p-2  text-left  ${
                          isActive
                            ? "bg-black text-white"
                            : "hover:bg-gray-50 hover:text-black"
                        }`
                      }
                    >
                      My Profile
                    </NavLink>
                  </SheetClose>
                  <SheetClose className="hover:bg-mist-100" asChild>
                    <NavLink
                      to="/orders"
                      className={({ isActive }) =>
                        ` grid p-2  text-left  ${
                          isActive
                            ? "bg-black text-white"
                            : "hover:bg-gray-50 hover:text-black"
                        }`
                      }
                    >
                      Orders
                    </NavLink>
                  </SheetClose>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button
                        className=" cursor-pointer text-red-500"
                        variant="ghost"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </>
              ) : (
                <SheetFooter>
                  <SheetClose asChild>
                    <Button
                      className=" cursor-pointer"
                      variant="ghost"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  </SheetClose>
                </SheetFooter>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;


