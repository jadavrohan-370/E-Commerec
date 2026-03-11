import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-12">
            <Link to="/" className="inline-block group">
              <span className="text-4xl font-bold tracking-tighter uppercase">
                Nova<span className="text-muted-foreground opacity-50">Store</span>
              </span>
            </Link>
            <p className="text-xl text-background/60 leading-relaxed max-w-md font-medium">
              We curate high-performance technology and sculptural aesthetics for the modern professional. 
              Elevating your digital and physical workspace.
            </p>
            <div className="flex gap-8">
               <a href="#" className="hover:opacity-50 transition-opacity"><Instagram size={24} /></a>
               <a href="#" className="hover:opacity-50 transition-opacity"><Twitter size={24} /></a>
               <a href="#" className="hover:opacity-50 transition-opacity"><Facebook size={24} /></a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <FooterSection title="Collections">
              <FooterLink to="/products">Shop All</FooterLink>
              <FooterLink to="/category/electronics">Electronics</FooterLink>
              <FooterLink to="/category/audio">Audio</FooterLink>
              <FooterLink to="/category/accessories">Accessories</FooterLink>
              <FooterLink to="/category/deals">Seasonal Offers</FooterLink>
            </FooterSection>

            <FooterSection title="Company">
              <FooterLink to="/about">Our Story</FooterLink>
              <FooterLink to="/craftsmanship">Craftsmanship</FooterLink>
              <FooterLink to="/sustainability">Sustainability</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </FooterSection>

            <FooterSection title="Support">
              <FooterLink to="/shipping">Shipping & Returns</FooterLink>
              <FooterLink to="/warranty">Warranty</FooterLink>
              <FooterLink to="/faq">Help Center</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
            </FooterSection>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-background/40">
            <span>© {new Date().getFullYear()} NEXA STORE GLOBAL</span>
            <span className="hidden md:block">|</span>
            <span className="hidden md:block">ALL RIGHTS RESERVED</span>
          </div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-background/80 hover:text-white transition-colors"
          >
            Back to Top <ArrowUpRight size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, children }) => (
  <div className="space-y-8">
    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-background/40">{title}</h4>
    <nav className="flex flex-col gap-4">
      {children}
    </nav>
  </div>
);

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm font-medium hover:opacity-50 transition-opacity flex items-center gap-1 group">
    {children}
  </Link>
);

export default Footer;
