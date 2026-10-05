import React from "react";

export default function HappyCustomerLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Prime-Style Smile Icon */}
      <svg
        className="w-14 h-14 text-amber-500 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://w3.org"
      >
        <circle cx="12" cy="12" r="10" />
        
        {/* Happy Eyes */}
        <circle cx="8.5" cy="9.5" r="1.2" className="text-white fill-current" />
        <circle cx="15.5" cy="9.5" r="1.2" className="text-white fill-current" />
        
        {/* Prime-Style Arrow Smile */}
        <path
          d="M 6 13 C 9 17.5 15 17.5 18 13"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrow Dimple/Head pointing up to the cheek */}
        <path
          d="M 17 14 L 18 13 L 18.5 14.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-xl font-black text-amazon_yellow tracking-tight leading-none uppercase">
          Prime
        </span>
        <span className="text-xs font-bold tracking-widest text-amber-600 uppercase mt-0.5">
          Customer
        </span>
      </div>
    </div>
  );
}