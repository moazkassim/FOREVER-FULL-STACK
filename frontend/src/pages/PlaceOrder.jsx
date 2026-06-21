import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/cartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    navigate,
    setCartItems,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      switch (method) {
        // api call for COD
        case "cod":
          try {
            const response = await axios.post(
              backendUrl + "/api/order/place",
              orderData,
              { headers: { token } },
            );
            if (response.data.success) {
              setCartItems({});
              navigate("/orders");
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
          break;
        case "razorpay":
        case "stripe":
          try {
            const responseStripe = await axios.post(
              backendUrl + "/api/order/stripe",
              orderData,
              { headers: { token } },
            );
            if (responseStripe.data.success) {
              const { session_url } = responseStripe.data;
              window.location.replace(session_url);
            } else {
              toast.error(responseStripe.data.message);
            }
          } catch (error) {
            console.log(error);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t "
    >
      {/*----------------------------------- left side --------------------------------  */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className=" text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className=" flex gap-3">
          <input
            required
            type="text"
            placeholder="First name"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
          />
          <input
            required
            type="text"
            placeholder="Last name"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
          />
        </div>
        <input
          required
          type="email"
          placeholder="Email address"
          className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
        />
        <input
          required
          type="text"
          placeholder="Street"
          className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
        />
        <div className=" flex gap-3">
          <input
            required
            type="text"
            placeholder="City"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
          />
          <input
            required
            type="text"
            placeholder="State"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
          />
        </div>
        <div className=" flex gap-3">
          <input
            required
            type="text"
            requiredmode="numeric"
            pattern="[0-9]*"
            placeholder="ZIP Code"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
          />
          <input
            required
            type="text"
            placeholder="Country"
            className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
          />
        </div>

        <input
          required
          type="tel"
          placeholder="Phone"
          className=" border border-gray-300 rounded py-1.5 px-3.5 w-full "
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
        />
      </div>
      {/* ---------------------------------- Right Side ------------------------------------- */}
      <div className=" mt-8">
        <div className=" mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className=" mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ---------------------------payment method ---------------------------------- */}
          <div className=" flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.stripe_logo} alt="" className=" h-5 mx-4" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img src={assets.razorpay_logo} alt="" className=" h-5 mx-4" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-400 text-sm font-m mx-4 ">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className=" w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
