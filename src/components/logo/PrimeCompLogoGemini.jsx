import React from "react";
import { motion } from "framer-motion";
import useIsMobile from "../../hooks/useIsMobile";
import PrimeComputerGear from "./PrimeComputerGear";
import "./PrimeCompLogo.css";

/* ============================================================
   1. EMBEDDED / EXTERNAL SVG LOGO WITH CSS ROTATION
============================================================ */
export function PrimeCompLogo({
  className = "prime-comp-logo",
  color = "currentColor",
}) {
  const isMobile = useIsMobile();
  const dimension = isMobile ? 38 : 52;

  return (
    <div className={`prime-logo-container ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 65"
        width={dimension}
        height={dimension}
        role="img"
        aria-label="Prime Computer logo"
        style={{ color }}
      >
        {/* ROTATING GEAR LAYER */}
        <g className="gear-spin-layer">
          <image
            href="/images/gear-trans.png"
            x="0"
            y="0"
            width="65"
            height="65"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* STATIC CENTER EMBLEM */}
        <g id="static-center-logo">
          <image
            href="/images/pc-logo.png"
            x="13"
            y="13"
            width="39"
            height="39"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  );
}

/* ============================================================
   2. MAIN LOGO + RESPONSIVE IMAGE TEXT COMPONENT
============================================================ */
export function PrimeCompWithText({
  className = "",
  size = "default",
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`prime-brand-logo ${className}`}
      data-testid="brand-logo"
    >
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="prime-brand-inner"
      >
        {/* LOGO ICON */}
        <motion.div layout className="prime-logo-wrapper">
           <PrimeComputerGear
               size="min(4vw, 60px)"
              duration={9}
             />
          {/*<img
            src="/images/gemini-svg-basic-rotaion.svg"
            alt="Prime Brand Logo"
            className="h-9 w-9 md:h-12 md:w-12 object-contain"
          />*/}
        </motion.div>

        {/* BRAND TEXT & SUBTITLE */}
        <motion.div layout className="prime-brand-heading">
          <div className="prime-brand-copy">
            
            {/* RESPONSIVE BRAND IMAGE TEXT */}
            <picture className="prime-brand-title-img">
              {/* Mobile View: Single image or fallback */}
              <source
                media="(max-width: 767px)"
                srcSet="/images/prime-computer-logo.png"
              />
              {/* Desktop View: Horizontal Full Text Logo */}
              <img
                src="/images/prime-computer-logo.png"
                alt="PRIME COMPUTER"
                className="brand-text-image h-6 md:h-9 max-w-[140px] md:max-w-[220px] object-contain"
              />
            </picture>

            {/* SUBTITLE */}
            <span className="prime-brand-subtitle text-[9px] md:text-[11px]">
              Your Shopping Paradise
            </span>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}