import React, { useId } from "react";
import "./PrimeComputerGear.css";

export default function PrimeComputerGear({
  src = "/images/prime-computer-gear.png",
  className = "",
  size = "min(92vw, 620px)",
  duration = 10,
}) {
  /*
   * React 18 useId() gives us a unique mask id.
   * Removing ":" keeps the SVG url(#...) reference simple.
   */
  const maskId = `primeGearMask${useId().replace(/:/g, "")}`;

  return (
    <div
      className={`prime-gear-logo ${className}`}
      style={{
        "--prime-gear-size": size,
        "--prime-gear-duration": `${duration}s`,
      }}
    >
      {/* ========================================================
          STATIC BASE IMAGE
          --------------------------------
          Contains:
          - gear
          - white center
          - PC emblem
      ========================================================= */}
      <img
        src={src}
        alt="Prime Computer"
        className="prime-gear-base"
        draggable="false"
      />

      {/* ========================================================
          ROTATING OVERLAY
          --------------------------------
          The SVG displays the SAME PNG,
          but the mask reveals ONLY the gear.
      ========================================================= */}
      <svg
        className="prime-gear-overlay"
        viewBox="0 0 1031 1029"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1031"
            height="1029"
          >
            {/* Outer visible area */}
            <circle
              cx="515.5"
              cy="514.5"
              r="505"
              fill="white"
            />

            {/* Cut out the entire centre */}
            <circle
              cx="515.5"
              cy="514.5"
              r="334"
              fill="black"
            />
          </mask>
        </defs>

        <g
          className="prime-gear-spin"
          style={{
            transformOrigin: "515.5px 514.5px",
          }}
        >
          <image
            href={src}
            x="0"
            y="0"
            width="1031"
            height="1029"
            preserveAspectRatio="none"
            mask={`url(#${maskId})`}
          />
        </g>
      </svg>

      {/* ========================================================
          STATIC CENTRE SAFETY LAYER
          --------------------------------
          This guarantees the PC letters/emblem never move.
      ========================================================= */}
      <div className="prime-gear-center">
        <img
          src={src}
          alt=""
          draggable="false"
        />
      </div>
    </div>
  );
}