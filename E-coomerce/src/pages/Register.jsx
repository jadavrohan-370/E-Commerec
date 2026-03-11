import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome to the community!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">Join Us</h1>
          <p className="text-muted-foreground">Discover curated products and exclusive tech perks.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email
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
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl shadow-2xl hover:opacity-90 transition-all flex justify-center items-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground mb-4">Already a member?</p>
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all"
          >
            Sign In Instead <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
