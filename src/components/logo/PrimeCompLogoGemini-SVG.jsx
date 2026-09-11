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
 
 

/**
 * Prime Computer Logo
 *
 * Behaviour:
 *  - Outer gear SVG rotates continuously.
 *  - Inner PC SVG remains completely stationary.
 *
 * NO:
 *  - useState
 *  - useEffect
 *  - Framer Motion
 *  - PrimeCompLogo.css
 *
 * Required files:
 *
 * public/
 * └── images/
 *     ├── prime-gear.svg
 *     └── prime-pc.svg
 */

export default function PrimeCompLogo({
  className = "prime-comp-logo",
  size = 65,

  // SVG files
  gearSrc = "/images/prime-gear.svg",
  pcSrc = "/images/prime-pc.svg",
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
          1. ROTATING GEAR
          ---------------------------------------------------------
          The gear SVG is fitted into the 65 x 65 logo.
          animateTransform rotates ONLY this group.

          Rotation centre:
                X = 32.5
                Y = 32.5
      ========================================================== */}

      <g id="prime-rotating-gear">

        <image
          href={gearSrc}
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
          2. STATIC PC EMBLEM
          ---------------------------------------------------------
          IMPORTANT:
          The PC SVG itself has a 512 x 512 canvas, but the actual
          embedded artwork occupies approximately:

                x = 142 ... 372
                y = 152 ... 352

          We therefore use a nested SVG viewport to crop the empty
          area and place the actual PC artwork inside the gear.
      ========================================================== */}

      <svg
        x="13"
        y="13"
        width="39"
        height="39"
        viewBox="142 152 230 200"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
      >

        <image
          href={pcSrc}
          x="0"
          y="0"
          width="512"
          height="512"
          preserveAspectRatio="none"
        />

      </svg>

    </svg>
  );
}
/* ============================================================
   2. MAIN LOGO + RESPONSIVE IMAGE TEXT COMPONENT
============================================================ */
export function PrimeCompWithText({
  children,
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
            <div className="flex justify-between mt-4">
          <div className="prime-brand-copy">
            
            {/* RESPONSIVE BRAND IMAGE TEXT */}
            <picture className="prime-brand-title-img">
              {/* Mobile View: Stacked Text Logos /images/pc-text-1.png,/images/pc-text-2.png*/} 
               {/*} srcSet="/images/prime-computer-logo.png"*/}
              <source
                media="(max-width: 767px)"
             srcSet="/images/prime-computer-logo-trans-new-small.png"
              />
              {/* Desktop View: Horizontal Full Text Logo */}
              <img
                src="/images/prime-computer-logo-trans-new-small.png"
                alt="PRIME COMPUTER"
                className="brand-text-image"
              />
            </picture>

            {/* SUBTITLE */}
            <span className="prime-brand-subtitle">
              Your Shopping Paradise
            </span>
            
          </div> 
          <div className="pl-4 mx-8"> 
           {children}</div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}