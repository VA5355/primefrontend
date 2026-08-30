import React, { useState } from 'react';

// The text is passed as a destructured prop: { text }
function CookieButton({ text = "🍪 Click to Grab!" }) {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyle = {
    display: 'inline-block',
    padding: '15px 30px',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#8B5A2B',
    backgroundColor: '#FFE4C4',
    borderRadius: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.15s ease-in-out',
    transform: isPressed ? 'translateY(4px)' : 'none',
    boxShadow: isPressed
      ? '0 2px 0 #CD9B1D, 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 -4px 0 #D2B48C'
      : '0 6px 0 #CD9B1D, 0 12px 20px rgba(0, 0, 0, 0.25), inset 0 -4px 0 #D2B48C',
  };

  return (
    <p
      style={baseStyle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {text}
    </p>
  );
}

export default CookieButton;
