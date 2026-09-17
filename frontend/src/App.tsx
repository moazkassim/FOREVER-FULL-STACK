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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BugReportForm } from "./pages/BugReportForm";
import { useSessionRestore } from "./hooks/useUser";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useSessionRestore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppInitializer>
          <Navbar />
          <div className=" pt-16 px-4 sm:px-[5vw] md:px-[7vw] lg:px[9vw]">
            <ToastContainer />
            <SearchBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:id/:token"
                element={<ResetPassword />}
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/verify" element={<Verify />} />

              <Route path="/BugReportForm" element={<BugReportForm />} />
            </Routes>
            <Footer />
          </div>
        </AppInitializer>
      </QueryClientProvider>
    </>
  );
};
