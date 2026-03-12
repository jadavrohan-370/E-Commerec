import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { id: 1, name: "Login", active: step1, link: "/login" },
    { id: 2, name: "Shipping", active: step2, link: "/shipping" },
    { id: 3, name: "Payment", active: step3, link: "/payment" },
    { id: 4, name: "Finalize", active: step4, link: "/placeorder" },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 py-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Indicator */}
          <div className="flex flex-col items-center group relative">
            <Link 
              to={step.active ? step.link : "#"}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                step.active 
                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "bg-background border-muted text-muted-foreground hover:border-foreground/50"
              }`}
            >
              {step.active && step.id < (steps.findLastIndex(s => s.active) + 1) ? (
                 <Check size={18} strokeWidth={3} />
              ) : (
                 <span className="text-xs font-bold">{step.id}</span>
              )}
            </Link>
            <span className={`absolute -bottom-8 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-500 ${step.active ? "text-primary" : "text-muted-foreground"}`}>
              {step.name}
            </span>
          </div>

          {/* Progress Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-[2px] bg-secondary mx-4 relative overflow-hidden rounded-full">
               <motion.div 
                 initial={{ scaleX: 0 }}
                 animate={{ scaleX: steps[index+1]?.active ? 1 : 0 }}
                 className="absolute inset-0 bg-primary origin-left transition-transform duration-700"
               />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
