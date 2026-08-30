import React from "react";
import { motion } from "framer-motion";
import useIsMobile from "../../hooks/useIsMobile";
 import "./PrimeCompLogo.css";

/* ============================================================
   1. EMBEDDED / EXTERNAL SVG LOGO WITH CSS ROTATION
============================================================
export function PrimeCompLogo({
  className = "prime-comp-logo",
  color = "currentColor",
}) {
  const isMobile = useIsMobile();
  const dimension = isMobile ? 52 : 65;

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
 */
 

export default function PrimeCompLogo({
  className = "prime-comp-logo",
  size = 65,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 65 65"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Prime Computer"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* =========================================================
          ROTATING OUTER GEAR
          ---------------------------------------------------------
          Gear occupies the complete 65 × 65 canvas.
          Rotation center = exact SVG center (32.5, 32.5)
      ========================================================== */}

      <g id="rotating-gear">

        <image
          href="/images/gear-trans.png"
          x="0"
          y="0"
          width="65"
          height="65"
          preserveAspectRatio="xMidYMid meet"
        />

        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 32.5 32.5"
          to="360 32.5 32.5"
          dur="8s"
          repeatCount="indefinite"
        />

      </g>


      {/* =========================================================
          STATIC PC EMBLEM
          ---------------------------------------------------------
          The PC is placed in the CENTER of the gear.
          Nothing rotates here.
      ========================================================== */}

      <g id="static-pc-logo">

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
         {/* }*/} <PrimeCompLogo className="logo" /> 
           {/* Shape 01 gemini-svg -css-rotate.svg
      <img
        src="/images/gemini-svg-basic-rotaion.svg"
        alt="Prime Brand"
      
      
      />*/}
        </motion.div>

        {/* BRAND TEXT & SUBTITLE */}
        <motion.div layout className="prime-brand-heading">
          <div className="prime-brand-copy">
            
            {/* RESPONSIVE BRAND IMAGE TEXT */}
            <picture className="prime-brand-title-img">
              {/* Mobile View: Stacked Text Logos /images/pc-text-1.png,/images/pc-text-2.png*/}
              <source
                media="(max-width: 767px)"
                srcSet="/images/prime-computer-logo.png"
              />
              {/* Desktop View: Horizontal Full Text Logo */}
              <img
                src="/images/prime-computer-logo.png"
                alt="PRIME COMPUTER"
                className="brand-text-image"
              />
            </picture>

            {/* SUBTITLE */}
            <span className="prime-brand-subtitle">
              Your Shopping Paradise
            </span>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}