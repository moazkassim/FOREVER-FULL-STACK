import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useCartStore } from "../stores/cartStore";
import { useShallow } from "zustand/shallow";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Item } from "@/components/ui/item";
import type { ProductType } from "@/types/product.types";
import { useProducts } from "@/hooks/useProducts";
import { getCartAmount } from "@/services/cartService";
import { useCartItems } from "@/hooks/useCart";
import {
  placeOrderSchema,
  type FormField,
  type OrderItem,
  type PlaceOrderValues,
} from "@/types/order.type";
import {
  useCashOnDeliverPlaceOrder,
  useStripePlaceOrder,
} from "@/hooks/useOrder";
const FormField = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled,
  className = "",
}: FormField) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid} className={className}>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Input
          {...field}
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />
        {fieldState.invalid && (
          <FieldError>{fieldState.error?.message}</FieldError>
        )}
      </Field>
    )}
  />
);
const PlaceOrder = () => {
  const { delivery_fee } = useCartStore(
    useShallow((state) => ({
      delivery_fee: state.delivery_fee,
    })),
  );
  const codPlaceOrder = useCashOnDeliverPlaceOrder();
  const stripePlaceOrder = useStripePlaceOrder();
  const isPlacingOrder = codPlaceOrder.isPending || stripePlaceOrder.isPending;
  const { data: productData, isPending, error } = useProducts();
  const { data: cart } = useCartItems();
  let cartAmount: any;
  if (productData?.products)
    cartAmount = getCartAmount(productData.products, cart.cartProducts);
  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  const form = useForm<PlaceOrderValues>({
    resolver: zodResolver(placeOrderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
      method: "cod",
    },
    mode: "onBlur",
  });
  const buildOrderItems = (): OrderItem[] => {
    const orderItems: OrderItem[] = [];
    Object.entries(cart.cartProducts).forEach(([productId, sizes]) => {
      Object.entries(sizes as []).forEach(([size, quantity]) => {
        if (quantity > 0) {
          const matchedProduct = productData.products.find(
            (product: ProductType) => product._id === productId,
          );
          if (matchedProduct) {
            orderItems.push({
              ...structuredClone(matchedProduct),
              size,
              quantity,
            } as any);
          }
        }
      });
    });
    return orderItems;
  };
  const onSubmit = async (data: PlaceOrderValues) => {
    try {
      const orderItems = buildOrderItems();

      const orderData = {
        address: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country,
          phone: data.phone,
        },
        items: orderItems,
        amount: cartAmount + delivery_fee,
      };

      switch (data.method) {
        case "cod": {
          codPlaceOrder.mutate(orderData);
          break;
        }
        case "razorpay":
        case "stripe": {
          stripePlaceOrder.mutate(orderData);
          break;
        }
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left side - Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-120">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3 w-full">
          <FormField
            name="firstName"
            control={form.control}
            placeholder="First name"
            disabled={isPlacingOrder}
            className="flex-1"
          />
          <FormField
            name="lastName"
            control={form.control}
            placeholder="Last name"
            disabled={isPlacingOrder}
            className="flex-1"
          />
        </div>

        <FormField
          name="email"
          control={form.control}
          type="email"
          placeholder="Email address"
          disabled={isPlacingOrder}
        />

        <FormField
          name="street"
          control={form.control}
          placeholder="Street"
          disabled={isPlacingOrder}
        />

        <div className="flex gap-3">
          <FormField
            name="city"
            control={form.control}
            placeholder="City"
            disabled={isPlacingOrder}
            className="flex-1"
          />
          <FormField
            name="state"
            control={form.control}
            placeholder="State"
            disabled={isPlacingOrder}
            className="flex-1"
          />
        </div>

        {/* ZIP Code & Country */}
        <div className="flex gap-3">
          <Controller
            name="zipcode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <Input
                  {...field}
                  id="zipcode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="ZIP Code"
                  disabled={isPlacingOrder}
                />
                {fieldState.invalid && (
                  <FieldError>{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />
          <FormField
            name="country"
            control={form.control}
            placeholder="Country"
            disabled={isPlacingOrder}
            className="flex-1"
          />
        </div>

        {/* Phone */}
        <FormField
          name="phone"
          control={form.control}
          type="tel"
          placeholder="Phone"
          disabled={isPlacingOrder}
        />
      </div>
      {/* Right side - Cart & Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 flex flex-col items-center">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* Payment Method Selection */}
          <Controller
            name="method"
            control={form.control}
            render={({ field }) => (
              <div className="flex gap-3 flex-col lg:flex-row">
                {/* Stripe */}
                <Item
                  variant="outline"
                  onClick={() => field.onChange("stripe")}
                  className={`flex items-center gap-2 p-4 cursor-pointer ${
                    field.value === "stripe" ? "border-blue-500" : ""
                  }`}
                >
                  <div
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      field.value === "stripe" ? "bg-green-400" : ""
                    }`}
                  />
                  <img
                    src={assets.stripe_logo}
                    alt="Stripe"
                    className="h-5 mx-4"
                  />
                </Item>

                {/* Razorpay */}
                <Item
                  variant="outline"
                  onClick={() => field.onChange("razorpay")}
                  className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                    field.value === "razorpay" ? "border-blue-500" : ""
                  }`}
                >
                  <div
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      field.value === "razorpay" ? "bg-green-400" : ""
                    }`}
                  />
                  <img
                    src={assets.razorpay_logo}
                    alt="Razorpay"
                    className="h-5 mx-4"
                  />
                </Item>

                {/* Cash on Delivery */}
                <Item
                  variant="outline"
                  onClick={() => field.onChange("cod")}
                  className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                    field.value === "cod" ? "border-blue-500" : ""
                  }`}
                >
                  <div
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      field.value === "cod" ? "bg-green-400" : ""
                    }`}
                  />
                  <p className="text-gray-400 text-sm font-medium mx-4">
                    CASH ON DELIVERY
                  </p>
                </Item>
              </div>
            )}
          />

          <Field className="flex items-center w-full text-end mt-8">
            <Button
              variant="outline"
              type="submit"
              disabled={isPlacingOrder}
              className="bg-black text-white max-w-54 px-16 py-3 text-sm cursor-pointer disabled:opacity-50"
            >
              {isPlacingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
            </Button>
          </Field>
        </div>
      </div>
    </form>
  );
};
export default PlaceOrder;
