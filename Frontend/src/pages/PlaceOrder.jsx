import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../store/slices/ordersApiSlice";
import { clearCartItems } from "../store/slices/cartSlice";
import { motion as Motion } from "framer-motion";
import {
  Package,
  Truck,
  CreditCard,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.street) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress.street, cart.paymentMethod, navigate]);

  // Calculate prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  const shippingPrice = addDecimals(itemsPrice > 5000 ? 0 : 150);
  const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2))); // 18% GST/Tax
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <CheckoutSteps step1 step2 step3 step4 />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Shipping Info */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary/10 border rounded-4xl p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <h2 className="font-bold uppercase tracking-widest text-xs">
                  Delivery Destination
                </h2>
              </div>
              <p className="text-lg font-medium">
                {cart.shippingAddress.fullName}
                <br />
                <span className="text-muted-foreground">
                  {cart.shippingAddress.street}, {cart.shippingAddress.city}
                </span>
                <br />
                <span className="text-muted-foreground">
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </span>
              </p>
            </Motion.div>

            {/* Payment Method */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-secondary/10 border rounded-4xl p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="font-bold uppercase tracking-widest text-xs">
                  Payment Method
                </h2>
              </div>
              <p className="text-lg font-medium flex items-center gap-3">
                {cart.paymentMethod}{" "}
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </p>
            </Motion.div>

            {/* Items Summary */}
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/10 border rounded-4xl p-8 md:p-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Package size={20} />
                </div>
                <h2 className="font-bold uppercase tracking-widest text-xs">
                  Bag Contents
                </h2>
              </div>

              <div className="space-y-8">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex gap-6 items-center group">
                    <div className="w-20 h-24 bg-background rounded-2xl border p-2 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold tracking-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                        {item.qty} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-lg font-medium">
                      ₹{(item.qty * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary text-primary-foreground rounded-4xl p-10 md:p-12 shadow-2xl sticky top-32"
            >
              <h2 className="text-3xl font-bold tracking-tighter mb-10">
                Grand Total
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center gap-4 opacity-70 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Sub-bag Total
                  </span>
                  <span className="text-xl font-medium">
                    ₹{Number(itemsPrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 opacity-70 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Courier (Global)
                  </span>
                  <span className="text-xl font-medium">
                    {Number(shippingPrice) === 0 ? "FREE" : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 opacity-70 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Est. Taxes (18%)
                  </span>
                  <span className="text-xl font-medium">
                    ₹{Number(taxPrice).toLocaleString()}
                  </span>
                </div>

                <div className="h-px bg-white/20 my-8" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Total to Pay
                  </span>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter break-all">
                    ₹{Number(totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-12 space-y-6">
                {error && (
                  <Message
                    variant="danger"
                    className="bg-white/10 text-white border-white/20"
                  >
                    {error?.data?.message || "Internal failure"}
                  </Message>
                )}

                <button
                  type="button"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                  className="w-full bg-white text-primary font-bold py-6 rounded-2xl shadow-xl hover:bg-opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6" />
                  ) : (
                    <>
                      Finalize Order{" "}
                      <ChevronRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 opacity-60">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Insured Transaction
                  </span>
                </div>
              </div>
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
