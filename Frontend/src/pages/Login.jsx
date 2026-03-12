import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome back");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                 Password
               </label>
               <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter">
                 Forgot?
               </button>
            </div>
            <input
              type="password"
              required
              className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl shadow-2xl hover:opacity-90 transition-all flex justify-center items-center gap-2 group active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">Don't have an account?</p>
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all"
          >
            Create an Account <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
