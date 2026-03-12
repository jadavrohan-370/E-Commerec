import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Package, Loader2, CheckCircle2, XCircle, Settings, ChevronRight, ExternalLink } from "lucide-react";
import { useProfileMutation } from "../store/slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../store/slices/ordersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { motion as Motion } from "framer-motion";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [prevId, setPrevId] = useState(userInfo?._id);
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const {
    data: orders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetMyOrdersQuery();

  if (userInfo?._id !== prevId) {
    setPrevId(userInfo?._id);
    setName(userInfo?.name || "");
    setEmail(userInfo?.email || "");
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Account updated");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 border-b pb-8">
           <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Account Dashboard</h1>
           <p className="text-muted-foreground mt-2 font-medium">Manage your profile and track your orders.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Profile Form Sidebar */}
          <div className="lg:col-span-4">
            <Motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary/20 rounded-4xl border p-8 sticky top-32"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                  <User size={32} />
                </div>
                <div>
                   <h2 className="text-xl font-bold tracking-tight">{userInfo?.name}</h2>
                   <p className="text-sm text-muted-foreground font-medium">{userInfo?.email}</p>
                </div>
              </div>

              <form onSubmit={submitHandler} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-background border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-background border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-background border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Leave blank to keep"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-background border-none rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingUpdateProfile}
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
                >
                  {loadingUpdateProfile ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>Update Profile <Settings size={18} /></>
                  )}
                </button>
              </form>
            </Motion.div>
          </div>

          {/* Orders Content */}
          <div className="lg:col-span-8">
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                   <Package className="text-primary" /> Recent Orders
                 </h2>
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                   {orders?.length || 0} Total Orders
                 </span>
              </div>

              {loadingOrders ? (
                <div className="py-20 flex justify-center"><Loader /></div>
              ) : errorOrders ? (
                <Message variant="danger">{errorOrders?.data?.message || errorOrders.error}</Message>
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div 
                        key={order._id}
                        className="bg-secondary/10 border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-primary transition-all"
                      >
                         <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-secondary rounded-md">#{order._id.substring(0, 10)}</span>
                               <span className="text-xs font-medium text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-2xl font-bold tracking-tight">₹{order.totalPrice.toLocaleString()}</div>
                         </div>

                         <div className="flex flex-wrap items-center gap-6">
                            <StatusBadge label="Paid" success={order.isPaid} />
                            <StatusBadge label="Delivered" success={order.isDelivered} />
                            
                            <Link 
                              to={`/order/${order._id}`}
                              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
                            >
                               View Details <ExternalLink size={14} />
                            </Link>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-secondary/10 rounded-4xl border border-dashed border-muted-foreground/30">
                       <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                       <h3 className="text-xl font-bold text-muted-foreground">No orders placed yet.</h3>
                       <Link to="/products" className="text-primary font-bold hover:underline mt-4 inline-block">Explore our catalog</Link>
                    </div>
                  )}
                </div>
              )}
            </Motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ label, success }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-background border rounded-full">
    {success ? (
      <CheckCircle2 size={16} className="text-green-500" />
    ) : (
      <XCircle size={16} className="text-destructive" />
    )}
    <span className={`text-[10px] font-bold uppercase tracking-widest ${success ? 'text-green-600' : 'text-destructive/80'}`}>
      {success ? `Confirmed ${label}` : `Pending ${label}`}
    </span>
  </div>
);

export default Profile;
