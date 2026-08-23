import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock hook fallback if not imported globally
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

export default function Footer() {
  const isMobile = useIsMobile();

  const sizes = {
    xssmall: { logo: "h-4 w-4", text: "text-xs" },
    small: { logo: "h-8 w-8", text: "text-xl" },
    default: { logo: "h-10 w-30", text: "text-2xl" },
    large: { logo: "h-12 w-12", text: "text-3xl" }
  };

  const [currentSize, setCurrentSize] = useState(sizes.default);

  useEffect(() => {
    let atSize = isMobile ? sizes.small : sizes.default;
    if (atSize !== undefined) {
      setCurrentSize(atSize);
    }
  }, [isMobile]);

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo Visiting Card Block */}
          <div className="col-span-1 md:col-span-2">
            
            {/* White Bakery-Biscuit Matte Visiting Card */}
            <div className="relative inline-block w-full max-w-md p-5 rounded-2xl border border-orange-200/80 shadow-2xl shadow-black/30 mb-6 overflow-hidden bg-[#faf8f5]">
              
              {/* Soft Powder Bloom */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white via-[#faf8f5] to-[#fff7ed] pointer-events-none" />
              
              {/* Card Inner Content Container */}
              <div className="relative z-10">
                
                {/* Brand Header Component */}
                <div className="flex items-center gap-2 brand-logo group cursor-pointer">
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center gap-3"
                  >
                    {/* PNG Logo - Clean 65x65 Image (No white square background) */}
                    <motion.div layout className="w-[65px] h-[65px] shrink-0">
                      <img 
                        src="/logo-footer-65.png" 
                        alt="Prime Computer & Network Logo" 
                        className="w-[65px] h-[65px] object-contain rounded-full drop-shadow-sm" 
                      />
                    </motion.div>
                    
                    {/* Single-line Header Style Heading */}
                    <motion.h1 layout className="text-lg font-bold md:text-2xl tracking-tight">
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black text-amber-950 tracking-tight whitespace-nowrap">
                          Prime Computer & Network
                        </span>
                        <span className="text-xs font-semibold text-slate-500 -mt-0.5">
                          Your Shopping Paradise
                        </span>
                      </div>
                    </motion.h1>
                  </motion.div>
                </div>

                {/* Subtitle / Tagline Strip with High-Contrast 2017 */}
                <div className="mt-4 pt-3 border-t border-amber-900/15 flex items-center justify-between text-[11px] font-black tracking-wider uppercase">
                  <span className="text-amber-950/80">PRIME METRO DELIVERY</span>
                  <span className="text-orange-600 font-extrabold bg-orange-100/80 px-2 py-0.5 rounded-md border border-orange-300/50">
                    SINCE 2017
                  </span>
                </div>

              </div>
            </div>

            <p className="text-gray-300 mb-4 max-w-md text-sm leading-relaxed">
              Your favorite brands, all in one place. Discover amazing products at unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-300 hover:text-orange-400 transition-colors">Shop</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-orange-400 transition-colors">Categories</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-orange-400 transition-colors">Cart</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-orange-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-orange-400 transition-colors">Support</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-orange-400 transition-colors">Returns</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-orange-400 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © Since 2017 Prime Computer & Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}