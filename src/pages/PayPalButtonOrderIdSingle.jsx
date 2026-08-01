import React, { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

const PayPalButtonOrderIdSingle = ({ handlePayPalOrderAndButton, totalAmount = "32399.35" }) => {
  const CONTAINER_ID = "paypal-button-container";
  const CLIENT_ID = "AVSehLByJG_4txyQye3YzEbrXLuS5X48JBYWFDcafkhvifIbWHZSqlQa_jt8ASMF5JvLAVu3SzGzmBkz";
  const isRenderingRef = useRef(false);
const paypalRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    // Clear inner HTML of the container before rendering to prevent duplication/orphan elements
    if (paypalRef.current) {
     // paypalRef.current.innerHTML = '';
    }
    // Helper: Polls localStorage every 200ms up to maxTimeout (5000ms)
    const waitForLocalStorageKey = (keyName, maxTimeoutMs = 5000, checkIntervalMs = 200) => {
      return new Promise((resolve) => {
        const startTime = Date.now();

        const interval = setInterval(() => {
          const rawValue = localStorage.getItem(keyName);

          if (rawValue) {
            clearInterval(interval);
            try {
              // Parse JSON if object was stored, or return string directly
              const parsedValue = JSON.parse(rawValue);
              resolve(parsedValue);
            } catch {
              resolve(rawValue);
            }
          } else if (Date.now() - startTime >= maxTimeoutMs) {
            clearInterval(interval);
            resolve(null);
          }
        }, checkIntervalMs);
      });
    };

    // Render PayPal Button Instance safely
    const renderPayPalButton = () => {
      const container = document.getElementById(CONTAINER_ID);

      // Prevent concurrent renders or rendering if container doesn't exist
      if (!container || isRenderingRef.current) return;

      // 1. Clear previous instances
      container.innerHTML = '';
      isRenderingRef.current = true;

      if (window.paypal && window.paypal.Buttons && paypalRef.current) {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'buynow'
          },

          createOrder: async (data, actions) => {
            // Trigger order creation in Checkout component if provided
            if (typeof handlePayPalOrderAndButton === 'function') {
              console.log("PayPal calling Checkout handlePayPalOrderAndButton...");
              await handlePayPalOrderAndButton();
            }

            // Wait for order object in localStorage
            const paypalOrder = await waitForLocalStorageKey("paypalOrder", 5000);
            const myCustomOrderId = typeof paypalOrder === 'object' ? paypalOrder?.name : paypalOrder;

            const formattedAmount = parseFloat(totalAmount).toFixed(2).toString();

            if (myCustomOrderId) {
              console.log("PayPal Order ID retrieved:", myCustomOrderId);
              return actions.order.create({
                purchase_units: [
                  {
                    invoice_id: myCustomOrderId,
                    custom_id: myCustomOrderId,
                    amount: {
                      value: formattedAmount,
                      currency_code: 'USD',
                    },
                  },
                ],
              });
            } else {
              toast.success('Processing PayPal Order...');
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: formattedAmount,
                      currency_code: 'USD',
                    },
                  },
                ],
              });
            }
          },

          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log("Payment Successful!", data.orderID, order);
            alert(`Transaction completed by ${order.payer.name.given_name}`);
          },

          onError: (err) => {
            console.error("PayPal Execution Error:", err);
          }
        })
        .render(paypalRef.current)
        //.render(`#${CONTAINER_ID}`)
        .then(() => {
          isRenderingRef.current = false;
        })
        .catch((err) => {
          isRenderingRef.current = false;
          console.error("PayPal Render Error:", err);
        });
      }
    };

    // Load SDK script if not loaded
    const existingScript = document.getElementById("paypal-sdk-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "paypal-sdk-script";
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&disable-funding=venmo`;
      script.crossOrigin = "anonymous";
      script.async = true;

      script.onload = () => {
        if (isMounted) renderPayPalButton();
      };

      document.head.appendChild(script);
    } else {
      renderPayPalButton();
    }

    // CLEANUP FUNCTION: Ensures old buttons are removed on unmount / re-render
   /* return () => {
      isMounted = false;
      isRenderingRef.current = false;
      const container = document.getElementById(CONTAINER_ID);
      if (container) {
        container.innerHTML = '';
      }
    };*/
  }, [totalAmount, handlePayPalOrderAndButton]);

  return (
    <div  className="my-4 flex justify-center">
      <div ref={paypalRef} id={CONTAINER_ID} style={{ width: '100%', maxWidth: '500px', minHeight: '150px' }} />
    </div>
  );
};

export default PayPalButtonOrderIdSingle;