import { useNavigate } from "react-router-dom";

const loadRazorpayScript = async () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export const useRazorpay = () => {
  const navigate = useNavigate();

  /**
   * @param {Object} orderData - The order payload / response object from your database API
   * @param {Object} deliveryInfo - Delivery information filled in checkout form
   * @param {String} razorpayKey - Your Razorpay Key ID (rzp_test_... or rzp_live_...)
   * @param {Function} dispatch - Redux dispatch function
   */
  const openRazorpay = async (orderData, deliveryInfo, razorpayKey, dispatch) => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      console.error("Razorpay SDK failed to load");
      return;
    }

    // Extract product descriptions or defaults
    const productNames = orderData?.products?.map((p) => p.name).join(", ");
    const descriptionText =orderData?.description ||
      productNames || orderData?.products?.[0]?.description || "Prime Computers Purchase";

    // Dynamic prefill values (falls back to buyer or deliveryInfo)
    const customerEmail =
      deliveryInfo?.email || orderData?.buyer?.email || "customer@primecomputers.in";
    const customerPhone =
      deliveryInfo?.phone || "9999999999";
    const customerName =
      deliveryInfo?.fullName || orderData?.buyer?.name || "Customer";

    // Amount calculation (Razorpay expects amount in paise, e.g., ₹100 = 10000)
    // If your backend amount is already in rupees (e.g. 18397.70), convert to paise:
    const amountInPaise = Math.round(
      parseFloat(orderData?.payment?.amount || orderData?.amount || 0) * 100
    );

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: orderData?.currency || "INR",
      order_id: orderData?.razorpayOrderId, // Pass official order_... ID here
      name: "Prime Computers",
      description: orderData?.description.slice(0, 255)  || descriptionText.slice(0, 255), // Max limit for description field

      // Optional: If you generated a Razorpay Order ID on your Node.js backend using razorpay SDK:
      // order_id: orderData?.razorpay_order_id, 

      // Dynamic Customer Details shown in Payment Modal & Dashboard
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      },

      // Notes Object: Recorded & visible inside Razorpay Dashboard
      notes: {
        internal_order_id: orderData?.id || "--", // e97d0f2b-d23d-4367-9671-d78e0f292ac4
        buyer_id: orderData?.buyerId || orderData?.buyer?.id || "--",
        address: `${deliveryInfo?.address || ''}, ${deliveryInfo?.city || ''} ${deliveryInfo?.postalCode || ''}`,
        country: deliveryInfo?.country || "India",
        app_name: "primecomputers.onrender.com"
      },

      // Handle client-side success callback
      handler: function (response) {
        console.log("Payment Successful. Payment ID:", response.razorpay_payment_id);

        // 1. Dispatch success to Redux slice
        if (dispatch) {
          dispatch({
            type: "payment/paymentSuccess",
            payload: {
              ...response,
              internalOrderId: orderData?.id,
            },
          });
        }

        // 2. Navigate to Customer Onboarding with payment details
        const params = new URLSearchParams({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || orderData?.id || "",
          razorpay_signature: response.razorpay_signature || "",
          internal_order_id: orderData?.id || "",
        }).toString();

        navigate(`/customeronboarding?${params}`);
      },

      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);

      if (dispatch) {
        dispatch({
          type: "payment/paymentFailure",
          payload: response.error,
        });
      }
    });

    rzp.open();
  };

  return { openRazorpay };
};