import React, { useEffect } from 'react';

const PayPalButton = ({handlePayPalOrderAndButton }) => {
  const BUTTON_ID = "ZN82WD4CHVC8Y";
  const CONTAINER_ID = `paypal-container-${BUTTON_ID}`;
  const CLIENT_ID = "AVSehLByJG_4txyQye3YzEbrXLuS5X48JBYWFDcafkhvifIbWHZSqlQa_jt8ASMF5JvLAVu3SzGzmBkz";

  useEffect(() => {


    // Helper function to remove the container-type style from PayPal's injected wrapper
    const removeContainerTypeStyle = (targetContainer) => {
      const observer = new MutationObserver(() => {
        const wrapper = document.getElementById(`paypal-form-fields-container-${BUTTON_ID}-wrapper`);
        if (wrapper) {
          // Remove inline style property completely
          wrapper.style.removeProperty('container-type');
          // Optional: ensure normal container behavior
          wrapper.style.containerType = 'normal';
        }
      });

      if (targetContainer) {
        observer.observe(targetContainer, { childList: true, subtree: true });
      }

      return observer;
    };
    let observerInstance;
    // 1. Function to render the PayPal Hosted Button
    const renderPayPalButton = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        // Clear container first to prevent duplicate renders
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
          container.innerHTML = '';
          // Start observing DOM insertions inside the PayPal container
          observerInstance = removeContainerTypeStyle(container);
        }
     
        window.paypal.HostedButtons({
          hostedButtonId: BUTTON_ID,
        })
        .render(`#${CONTAINER_ID}`)
        .catch((err) => console.error("PayPal Render Error:", err));
      }
    };

    // 2. Check if script is already present on page
    const existingScript = document.getElementById("paypal-sdk-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "paypal-sdk-script";
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`;
      script.crossOrigin = "anonymous";
      script.async = true;

      script.onload = () => {
        renderPayPalButton();
      };

      document.head.appendChild(script);
    } else {
      // SDK already loaded, render immediately
      renderPayPalButton();
    }
    // Cleanup observer on unmount
    return () => {
      if (observerInstance) {
        observerInstance.disconnect();
      }
    };

  }, [BUTTON_ID, CONTAINER_ID, CLIENT_ID]);

  return (
    <div className="my-4 flex justify-center">
      <div id={CONTAINER_ID}  />
    </div>
  );
};

export default PayPalButton;