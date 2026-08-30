import React from "react";
import "./ChocolateStyles.css";

export default function GradientShadowLine({
  children = "This is your gradient text with a shadow.",
  className = "",
}) {
  return (
    <p className={`gradient-shadow-text-line ${className}`}>
      {children}
    </p>
  );
}