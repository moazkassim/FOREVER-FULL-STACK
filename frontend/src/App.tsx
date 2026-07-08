import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import Verify from "./pages/Verify";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import { useProductStore } from "./stores/productStore";
import { useEffect } from "react";
export const AppInitializer = () => {
  const { restoreSession } = useAuthStore();
  const { getUserCart } = useCartStore();
  const { getProductsData } = useProductStore();
  useEffect(() => {
    const init = async () => {
      await restoreSession();
      getProductsData();
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        getUserCart();
      }
    };
    init();
  }, []);
  return null;
};
export const App = () => {
  return (
    <>
      <AppInitializer />
      <div className=" px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]">
        <ToastContainer />
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
        <Footer />
      </div>{" "}
    </>
  );
};
