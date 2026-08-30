import React from "react";

import "./PrimeCompLogo.css";

export function PrimeCompLogo({
  className = "prime-comp-logo",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 65 65"
      className={className}
      role="img"
      aria-label="Prime Computer logo"
    >
      <style>{`
        .prime-gear {
          transform-box: fill-box;
          transform-origin: center;
          animation: primeGearSpin 6s linear infinite;
        }

        @keyframes primeGearSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .prime-gear {
            animation: none;
          }
        }
      `}</style>

      <g className="prime-gear">
        <image
          href="/images/gear-trans.png"
          x="0"
          y="0"
          width="65"
          height="65"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      <g>
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