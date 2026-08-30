import React from "react";
import { motion } from "framer-motion";

import useIsMobile from "../../hooks/useIsMobile";

import "./PrimeCompLogo.css";

/* ============================================================
   PRIME COMPUTER LOGO
============================================================ */

export function PrimeCompLogo({
  className = "prime-comp-logo",
  color = "currentColor",
}) {
  const isMobile = useIsMobile();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 65 65"
      className={className}
      width={isMobile ? 52 : 65}
      height={isMobile ? 52 : 65}
      role="img"
      aria-label="Prime Computer logo"
      style={{ color }}
    >
      {/* ==========================================================
          1. ROTATING GEAR
      =========================================================== */}
      <g className="gear-spin">
        <image
          href="/images/gear-trans.png"
          x="0"
          y="0"
          width="65"
          height="65"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      {/* ==========================================================
          2. STATIC CENTER EMBLEM
      =========================================================== */}
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
  );
}


/* ============================================================
   PRIME COMPUTER LOGO + TEXT
============================================================ */

export function PrimeCompWithText({
  className = "",
  size = "default",
}) {
  const isMobile = useIsMobile();

  /*
   * On mobile we intentionally use the small presentation.
   * On desktop the caller-selected size is respected.
   */
  const resolvedSize =
    isMobile
      ? "small"
      : ["xssmall", "small", "default", "large"].includes(size)
        ? size
        : "default";

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

        {/* ======================================================
            RESPONSIVE LOGO
        ======================================================= */}
        <motion.div
          layout
          className={`prime-logo-wrapper prime-logo-${resolvedSize}`}
        >
          <PrimeCompLogo
            className="prime-comp-logo logo"
          />
        </motion.div>

        {/* ======================================================
            BRAND TEXT
        ======================================================= */}
        <motion.h1
          layout
          className="prime-brand-heading"
        >
          <div className="prime-brand-copy">

            {/* ==================================================
                MAIN BRAND TITLE

                Original Tailwind:

                bg-gradient-to-r
                from-amber-950
                via-orange-600
                to-amber-500
                dark:from-orange-500
                dark:via-amber-400
                dark:to-yellow-300
                bg-clip-text
                text-transparent
                group-hover:scale-105
                whitespace-nowrap
            =================================================== */}

           {/*  <span
              className={`prime-brand-title prime-brand-title-${resolvedSize}`}
            >
              Prime Computer &amp; Network
            </span>*/}
            <h1 class="prime-logo-text">
                <span class="black">PRIME</span>
                <span class="orange">COMPUTER</span>
                </h1>

            {/* ==================================================
                SUBTITLE
            =================================================== */}
            <span className="prime-brand-subtitle">
              Your Shopping Paradise
            </span>

          </div>
        </motion.h1>

      </motion.div>
    </div>
  );
}