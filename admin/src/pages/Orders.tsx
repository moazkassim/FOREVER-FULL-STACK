import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets.ts";
import type { ChangeEvent } from "react";
interface LoginProps {
  token: string;
  backendUrl: string;
  currency: string;
}
interface OrderItem {
  name: string;
  quantity: number;
  size: string;
}

interface OrderAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  address: OrderAddress;
  amount: number;
  paymentMethod: string;
  payment: boolean;
  date: string;
  status: string;
}

const Orders = ({ token, backendUrl, currency }: LoginProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };
  const statusHandler = async (
    event: ChangeEvent<HTMLSelectElement>,
    orderId: string,
  ) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: event.target.value as string,
        },
        { headers: { token } },
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };
  useEffect(() => {
    fetchAllOrders();
  }, [token]);
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order, index) => (
          <div
            className=" grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr]  lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return (
                      <p className=" py-0.5" key={index}>
                        {item.name} x {item.quantity}
                        <span>{item.size}</span>
                      </p>
                    );
                  } else {
                    return (
                      <p className=" py-0.5" key={index}>
                        {item.name} x {item.quantity}
                        <span>{item.size}</span>,
                      </p>
                    );
                  }
                })}
              </div>
              <p className=" mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ", "}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items : {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment:{order.payment ? "Done" : "Pending"}</p>
              <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className=" text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              className=" p-2 font-semibold"
              value={order.status}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="out for delivery">Out For Delivery </option>
              <option value="Delivered">Delivered </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orders;
