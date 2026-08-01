import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const PayPalButtonOrderId = ({ handlePayPalOrderAndButton ,  totalAmount = "32399.35" }) => {
  const CONTAINER_ID = "paypal-button-container";
  const CLIENT_ID = "AVSehLByJG_4txyQye3YzEbrXLuS5X48JBYWFDcafkhvifIbWHZSqlQa_jt8ASMF5JvLAVu3SzGzmBkz";

  useEffect(() => {
    // 1. Render standard PayPal Smart Buttons
    const renderPayPalButton = () => {
      if (window.paypal && window.paypal.Buttons) {
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
          container.innerHTML = ''; // Clear container to avoid duplicate buttons
        }

        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'buynow'
          },

          // THIS IS WHERE YOU PASS/CREATE THE ORDER ID WHEN CLICKED:
          createOrder: async (data, actions) => {
            if(handlePayPalOrderAndButton !==undefined ) {
                  console.log("  PayPal calling Checkout JSX handlePayPalOrderAndButton for  Order placement ...  " );  
                       handlePayPalOrderAndButton()


            }
           //  localStorage.setItem('paypalOrder',payload);
         // this is set so that the PayPalButtonOrderId can read the payPalOrder generated above 

          // 1. Helper function that polls localStorage every 200ms up to maxTimeout (5000ms)
                const waitForLocalStorageKey = (keyName, maxTimeoutMs = 5000, checkIntervalMs = 200) => {
                  return new Promise((resolve) => {
                    const startTime = Date.now();

                    const interval = setInterval(() => {
                      const value = localStorage.getItem(keyName);

                      // If the key is set (and not empty)
                      if (value !== null && value !== undefined && value !== "") {
                        clearInterval(interval);
                        resolve(value);
                      } 
                      // If timeout reached (5 seconds elapsed)
                      else if (Date.now() - startTime >= maxTimeoutMs) {
                        clearInterval(interval);
                        resolve(null); // Resolves null if key was not set in time
                      }
                    }, checkIntervalMs);
                  });
                };

                // 2. Wait for the key to be set in localStorage
                const paypalOrder = await waitForLocalStorageKey("paypalOrder", 5000);
                if(paypalOrder !== undefined){ 

                    let myCustomOrderId = paypalOrder?.name;
                console.log(" PayPal Order ID as set by  handlePayPalOrderAndButton in Check Out JSX "+myCustomOrderId)

                       return actions.order.create({
                            purchase_units: [
                                { 
                                    // 1. Appears on PayPal merchant dashboard & customer receipts
                                        invoice_id: myCustomOrderId, // e.g., "ORD-2026-99823"

                                        // 2. Custom internal reference (up to 127 characters)
                                        custom_id: myCustomOrderId,
                                amount: {
                                    value: totalAmount.toString(), // Passes the dynamic total amount
                                    currency_code: 'USD',
                                },
                                },
                            ],
                            });
                }
                else {
                      toast.success('Pay Pal Order processing , Prime Computers Order not available ');
                      let totalAmtTwoDec  =  parseFloat(totalAmount).toFixed(2)
                     return actions.order.create({
                            purchase_units: [
                                { 
                                   
                                amount: {
                                    value: totalAmtTwoDec.toString(), // Passes the dynamic total amount
                                    currency_code: 'USD',
                                },
                                },
                            ],
                            });
                }
          },

          // Triggered when payment is approved by buyer
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log("Payment Successful! Order ID:", data.orderID, order);







            alert(`Transaction completed by ${order.payer.name.given_name}`);
            // Navigate or call backend endpoint here...
          },

          onError: (err) => {
            console.error("PayPal Execution Error:", err);
          }
        })
        .render(`#${CONTAINER_ID}`)
        .catch((err) => console.error("PayPal Render Error:", err));
      }
    };

    // 2. Load SDK without `components=hosted-buttons`
    const existingScript = document.getElementById("paypal-sdk-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "paypal-sdk-script";
      // Notice: `components=hosted-buttons` removed to enable standard dynamic buttons
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD&disable-funding=venmo`;
      script.crossOrigin = "anonymous";
      script.async = true;

      script.onload = () => {
        renderPayPalButton();
      };

      document.head.appendChild(script);
    } else {
      renderPayPalButton();
    }
  }, [totalAmount]);

  return (
    <div className="my-4 flex justify-center">
      <div id={CONTAINER_ID} style={{ width: '100%', maxWidth: '500px' }} />
    </div>
  );
};

export default PayPalButtonOrderId;