import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetRazorpayClientIdQuery,
  useCreateRazorpayOrderMutation,
} from "../store/slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import {
  Package,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Mail,
  MapPin,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder] = usePayOrderMutation();
  const { data: configAuth } = useGetRazorpayClientIdQuery();
  const [createRazorpayOrder, { isLoading: loadingRazorpayOrder }] =
    useCreateRazorpayOrderMutation();

  useEffect(() => {
    if (!order || order.isPaid) return;

    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [order]);

  const successPaymentHandler = async (paymentResult) => {
    try {
      await payOrder({
        orderId,
        details: {
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_signature: paymentResult.razorpay_signature,
        },
      });
      refetch();
      toast.success("Transaction Securely Completed");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const displayRazorpay = async () => {
    if (!configAuth) return;

    try {
      const rzpOrderData = await createRazorpayOrder(orderId).unwrap();

      const options = {
        key: configAuth.clientId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: "NOVA STORE",
        description: "Official Acquisition",
        image:
          "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=200&auto=format&fit=crop",
        order_id: rzpOrderData.id,
        handler: function (response) {
          successPaymentHandler(response);
        },
        prefill: {
          name: order.user.name,
          email: order.user.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay Load Error:", err);
      toast.error("Failed to initialize encrypted payment");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 pt-32">
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 border-b pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
              <Package size={14} /> Transaction Record
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border ${order.isPaid ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-destructive/10 border-destructive/20 text-destructive"}`}
            >
              {order.isPaid ? "Payment Confirmed" : "Payment Required"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Customer & Delivery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/10 border rounded-4xl p-8"
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                  <Calendar size={14} /> Acquisition Details
                </h3>
                <div className="space-y-4">
                  <p className="text-lg font-bold tracking-tight">
                    {order.user.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} /> {order.user.email}
                  </div>
                </div>
              </Motion.div>

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/10 border rounded-4xl p-8"
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                  <MapPin size={14} /> Delivery Address
                </h3>
                <p className="text-sm font-medium leading-relaxed">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </Motion.div>
            </div>

            {/* Status Section */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/10 border rounded-4xl p-8 md:p-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                    Payment Tracking
                  </h3>
                  {order.isPaid ? (
                    <div className="flex items-center gap-3 text-green-600 bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                      <CheckCircle2 size={20} />
                      <div>
                        <p className="text-sm font-bold">Paid Securely</p>
                        <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">
                          {new Date(order.paidAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-destructive bg-destructive/5 p-4 rounded-2xl border border-destructive/10">
                      <AlertCircle size={20} />
                      <div>
                        <p className="text-sm font-bold">Unpaid Transaction</p>
                        <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">
                          Awaiting Funds
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
                    Logistics Status
                  </h3>
                  <div className="flex items-center gap-3 text-primary bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <Truck size={20} />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">
                        {order.orderStatus}
                      </p>
                      <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">
                        {order.isDelivered
                          ? `Arrived on ${new Date(order.deliveredAt).toLocaleDateString()}`
                          : "In Transit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>

            {/* Order Items */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-secondary/10 border rounded-4xl p-8 md:p-10"
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10 pb-4 border-b">
                Acquired Pieces
              </h2>
              <div className="space-y-8">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex gap-8 items-center group">
                    <div className="w-24 h-28 bg-background rounded-3xl border p-2 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold tracking-tighter mb-2 uppercase">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        {item.qty} Unit(s) × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-2xl font-medium tracking-tight">
                      ₹{(item.qty * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* Invoice Summary Card */}
          <div className="lg:col-span-4">
            <Motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-foreground text-background rounded-4xl p-10 md:p-12 sticky top-32 shadow-2xl"
            >
              <h2 className="text-3xl font-bold tracking-tighter mb-10">
                Invoice
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Net Value
                  </span>
                  <span className="text-lg font-medium">
                    ₹{order.itemsPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Logistics
                  </span>
                  <span className="text-lg font-medium">
                    ₹{order.shippingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center opacity-40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Surcharge (Tax)
                  </span>
                  <span className="text-lg font-medium">
                    ₹{order.taxPrice.toLocaleString()}
                  </span>
                </div>

                <div className="h-px bg-background/10 my-8" />

                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
                    Total Amount
                  </span>
                  <span className="text-5xl font-bold tracking-tighter">
                    ₹{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {!order.isPaid && (
                <div className="mt-12 space-y-4">
                  <button
                    onClick={displayRazorpay}
                    disabled={loadingRazorpayOrder}
                    className="w-full bg-background text-foreground font-bold py-6 rounded-2xl shadow-xl hover:opacity-90 transition-all flex justify-center items-center gap-3 group active:scale-[0.98]"
                  >
                    {loadingRazorpayOrder ? (
                      <Loader className="w-6 h-6" />
                    ) : (
                      <>
                        Complete Payment{" "}
                        <CreditCard
                          size={20}
                          className="group-hover:rotate-12 transition-transform"
                        />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    Protected by 256-bit Bank Encryption
                  </p>
                </div>
              )}
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
