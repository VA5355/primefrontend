import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ShieldCheck, AlertCircle, ArrowRight, X  } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { toast } from 'react-hot-toast';
import {
  CreditCard, MapPin, User, Mail, Phone, Home,
  ShoppingCart, ArrowLeft, Shield, Truck, Clock
} from 'lucide-react';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
 import   useIsMobile   from '../hooks/useIsMobile';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { REACT_APP_RAZORORDERANDPAYMENTURL } from '../libs/client';
import usePageTitle from '../hooks/usePageTitle';
import {ReduxProvider} from '../providers/ReduxProvider'
import { ModalProvider } from '../providers/ModalProvider';
import RazorPayButton from './RazorPayButton';
import PaymentContainer from './PaymentContainer';
import PayPalButton from './PayPalButton';
import PayPalButtonOrderId from './PayPalButtonOrderId';
import PayPalButtonOrderIdSingle from './PayPalButtonOrderIdSingle';


 function     getTimeSeriesFormattedTimeKey()  {
  const now = new Date();
  const year = now.getFullYear().toString().padStart(2, '0');
  const month = now.getMonth().toString().padStart(2, '0');
  const day = now.getDay().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  let min5 = now.getMinutes() ;
       min5 = min5  - 5;
  const min = min5.toString().padStart(2, '0');
  const sec = now.getSeconds().toString().padStart(2, '0');
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export default function Checkout() {
  usePageTitle('Checkout');
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Payment states
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
    // CHECK MOBILE OR DESTOP
  // const isMobile = useIsMobile();
  let isMobile = false;
    const [showDesktopQR, setShowDesktopQR] = useState(false);
 const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
   /** Razor Payment functions  */
      const [gpayamount, setGpayAmount] = useState(0);
        const [gpayOrderId, setGpayOrderId] = useState(null);
         const [gpayCustomer, setGpayCustomer] = useState(null); 
         const [isTrialGooglePayOpen, setIsTrialGooglePayOpen] = useState(false);
  // Form states
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: auth?.user?.phone || '',
    address: auth?.user?.address || '',
    city: '',
    postalCode: '',
    country: 'United States'
  });
    let merchantVPA = '7588230462@okbizaxis';
   let merchantName = 'Store%20Notify';

  const [ merchantUpiLink  , setMerchantUpiLink] = useState(''); 
  // = `upi://pay?pa=${merchantVPA}&pn=${merchantName}&am=${amount}&cu=INR&tn=Order_${orderId}`;

/*
  useEffect(() => {
    if (!cart?.length) {
      navigate('/cart');
      return;
    }
    if (auth?.token) {
      getClientToken();




    }
  }, [auth?.token, cart?.length, navigate]); */
    // Timer Logic
 /*useEffect(() => {
    if (!showDesktopQR) return;
    if (timeLeft === 0) {
      setShowDesktopQR(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showDesktopQR, timeLeft]);
  */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const openUPI = () => {
  const upiLink = merchantUpiLink;

  // Try intent (best for Android Chrome)
  const intentLink = `intent://${upiLink.replace('upi://', '')}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;

  if (/Android/i.test(navigator.userAgent)) {
    window.location.href = intentLink;
  } else {
    window.location.href = upiLink;
  }
};



  const getClientToken = async () => {
    try {
       const baseUrl =
             ( window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
               ?  `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL}`
                : `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL}`;
      console.log('window.location.hostname '+window.location.hostname)
      console.log('REACT_APP_NGROKLOCALHOST '+process.env.REACT_APP_NGROKLOCALHOST)
      console.log('baseUrl '+baseUrl)
      const { data } = await axios.get(`${baseUrl}/api/braintree/getToken`);
      setClientToken(data.clientToken);
    } catch (err) {
      console.error(err);
      toast.error('Failed to initialize payment');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 10;
  };
  const getShortDateTime  = () => {
    const now = new Date();
    const shortIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' });
      console.log("shortIST "+shortIST); 
    /*
    const shortDateTime = now.toLocaleString('en-IN', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });
    console.log(shortDateTime); */
     return shortIST;
  }
  const getShortDayWithSeconds = () => {
    /*
        const options = { 
      weekday: 'short',    // "Mon", "Tue", etc.
      timeZone: 'Asia/Kolkata', 
      hour12: false,       // Use true for 12-hour AM/PM format
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };

    const formatter = new Intl.DateTimeFormat('en-IN', options);
     */
        const options = { 
      timeZone: 'Asia/Kolkata',
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false // Set to true for AM/PM format
    };

    const istDateTime = new Date().toLocaleString('en-IN', options);
    console.log(istDateTime); 
    // Output example: "Wed, 22 Jul 2026, 10:02:15"
    let formatNoSpaceComa = istDateTime.replace(", ","_").replace(" ","_").trim();
    console.log("ShortDayWithSeconds :: " + formatNoSpaceComa); 
    return formatNoSpaceComa;

  }
  const getDeliveryToUserDetails = () => {
        const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
     let deliveryUser = "";   
    for (const field of required) {

      if (!deliveryInfo[field]?.trim()) {
       // toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);

         deliveryUser = deliveryUser + " "+field+" : NA"
      }
      else {
           deliveryUser = deliveryUser +  " "+field+ " : " + deliveryInfo[field]?.trim()
      }
    }
     return deliveryUser;
  }
  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    let total =  calculateSubtotal() + calculateShipping() + calculateTax();
    setMerchantUpiLink( `upi://pay?pa=${merchantVPA}&pn=${merchantName}&am=${total}&cu=INR`) // &tn=Order_${orderId}

    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!auth?.token) {
      toast.error('Please login to complete checkout');
      navigate('/login', { state: '/checkout' });
      return false;
    }

    const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    for (const field of required) {
      if (!deliveryInfo[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!instance) {
      toast.error('Payment method not initialized');
      return false;
    }

    return true;
  };
  const handlePaymentClick = (e) => {
    // Check if user is on Desktop (simple check)
    /*if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      e.preventDefault();
      setShowDesktopQR(true);
      setTimeLeft(180); // Reset timer when opened
    }*/
   /*  if (isMobile) {
    // Mobile → open UPI directly
        return;
    } else {
        // Desktop → show QR
        e.preventDefault();
        setShowDesktopQR(true);
        setTimeLeft(180);
    }*/ 
    if (isMobile) {
         openUPI();

    setTimeout(() => {
      setShowDesktopQR(true);
    }, 1500);

  } else {
    e.preventDefault();
    setShowDesktopQR(true);
  }


  };
  const handleRazorPayOrderAndButton = async () => {
    if (!validateForm())
      {
  console.log("handleRazorPayORderandButton :: validating RazorPayOrder Checkout Form failed  ")
        return;
      } 

    try {
      setLoading(true);
      let description = "Cart initiated at "+getShortDateTime() +" by "+getDeliveryToUserDetails() ;
      //   const { nonce } =  await Promise.resolve(description)  // this does not set the nounce
         //  const   nonce  =   (descriptionAct)    /// descriptive does not work lets try some one time numeric number 
        const num = Math.floor(1000000000 + Math.random() * 9000000000); // cannot start with 0 
       // const num = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
          console.log('nonce :: ' +num); // Example: 4820519374
              const   nonce  = num;
     let isRazorPayOrderReady = false; 
      // CREATE A Razor Pay Order at Prime Computer & Network DATABASE
      
      let payload = { }
      if(cart !==undefined && Array.isArray(cart) && cart.length >0){
         if(deliveryInfo !== undefined){
             payload.name = "razorPayOrder_"+deliveryInfo.email+"_"+getShortDayWithSeconds();
             payload.deliveryInfo = deliveryInfo;
             payload.cart = cart;
         }
            
      } 
      // await axios.post(`/category/create`, { name: name.trim() });
        try {
            const baseUrl =
              ( window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
                ?  `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL}`
                : `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL}`;
                  // https://onedinaar.com
            // `${baseUrl}/api/razorpayorder/create`,
            /**
               {
                params: payload,
                withCredentials: true,
              }
             */
            console.log("handleRazorPayORderandButton :: sending RazorPayOrder to  "+JSON.stringify(axios.baseUrl))
            console.log("handleRazorPayORderandButton :: payload ::  "+JSON.stringify(payload))
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
                const razorpayorderstatus = await waitForLocalStorageKey("razorpayorderstatus", 5000);

                // 3. Perform navigation and actions based on the status retrieved
                if (!razorpayorderstatus || razorpayorderstatus !== "success") {
                  toast.error('Order placement had ISSUES, Please Try again!');
                  navigate('/cart');
                } else {
                  console.log("handleRazorPayORderandButton :: status :: " + razorpayorderstatus);
                  /* avoid this till the Razor payment flow is completed 
                  localStorage.removeItem('cart');
                  localStorage.removeItem('razorpayorderstatus'); // Clean up status key
                  setCart([]);
                  toast.success('Order placed successfully!');
                  navigate('/dashboard/user/orders');
                  */
                }


          } catch (err ) {
           //  return rejectWithValue(err.response?.data || "Order failed");
             console.error("Razor Pay Order "+err.response?.data || "Order failed");
               toast.error('Razor Pay Order creation failed. Please try again.');
          }
     // const { nonce } = await instance.requestPaymentMethod();
      
   /* THis STEP stried in Razor Pay Button 
       await axios.post(`/braintree/payment`, {
        nonce,
        cart,
        deliveryInfo
      });
          */
    
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
 const handlePayPalOrderAndButton = async () => {
    if (!validateForm())
      {
  console.log("handlePayPalOrderAndButton :: validating PayPalOrder Checkout Form failed  ")
        return;
      } 

    try {
      setLoading(true);
      let description = "Cart initiated at "+getShortDateTime() +" by "+getDeliveryToUserDetails() ;
      //   const { nonce } =  await Promise.resolve(description)  // this does not set the nounce
         //  const   nonce  =   (descriptionAct)    /// descriptive does not work lets try some one time numeric number 
        const num = Math.floor(1000000000 + Math.random() * 9000000000); // cannot start with 0 
       // const num = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
          console.log('nonce :: ' +num); // Example: 4820519374
              const   nonce  = num;
     let isPayPalOrderReady = false; 
      // CREATE A Razor Pay Order at Prime Computer & Network DATABASE
      
      let payload = { }
      if(cart !==undefined && Array.isArray(cart) && cart.length >0){
         if(deliveryInfo !== undefined){
             payload.name = "payPalOrder_"+deliveryInfo.email+"_"+getShortDayWithSeconds();
             payload.deliveryInfo = deliveryInfo;
             payload.cart = cart;
         }
         localStorage.setItem('paypalOrder',payload);
         // this is set so that the PayPalButtonOrderId can read the payPalOrder generated above 

      } 
      // await axios.post(`/category/create`, { name: name.trim() });
        try {
            const baseUrl =
              ( window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
                ?  `${process.env.REACT_APP_PAYPALORDERANDPAYMENTURL_LOCAL}`
                : `${process.env.REACT_APP_PAYPALORDERANDPAYMENTURL}`;
                  // https://onedinaar.com
            // `${baseUrl}/api/razorpayorder/create`,
            /**
               {
                params: payload,
                withCredentials: true,
              }
             */
            console.log("handlePayPalORderandButton :: sending handlePayPalOrder to  "+JSON.stringify(axios.baseUrl))
            console.log("handlePayPalORderandButton :: payload ::  "+JSON.stringify(payload))
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
                const paypalorderstatus = await waitForLocalStorageKey("papalorderstatus", 5000);

                // 3. Perform navigation and actions based on the status retrieved
                if (!paypalorderstatus || paypalorderstatus !== "success") {
                  toast.error('Order placement had ISSUES, Please Try again!');
                  navigate('/cart');
                } else {
                  console.log("handlePayPalORderandButton :: status :: " + paypalorderstatus);
                  /* avoid this till the Razor payment flow is completed 
                  localStorage.removeItem('cart');
                  localStorage.removeItem('razorpayorderstatus'); // Clean up status key
                  setCart([]);
                  toast.success('Order placed successfully!');
                  navigate('/dashboard/user/orders');
                  */
                }


          } catch (err ) {
           //  return rejectWithValue(err.response?.data || "Order failed");
             console.error("Pay Pal Order "+err.response?.data || "Order failed");
               toast.error('Pay Pal  Order creation failed. Please try again.');
          }
     // const { nonce } = await instance.requestPaymentMethod();
      
   /* THis STEP stried in Razor Pay Button 
       await axios.post(`/braintree/payment`, {
        nonce,
        cart,
        deliveryInfo
      });
          */
    
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
       const baseUrl =
                  ( window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
                    ?  `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL}`
                : `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL}`;
      await axios.post(`${baseUrl}/api/braintree/payment`, {
        nonce,
        cart,
        deliveryInfo
      });

      localStorage.removeItem('cart');
      setCart([]);
      toast.success('Order placed successfully!');
      navigate('/dashboard/user/orders');
    } catch (err) {
      console.error(err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 /** Razor Payment functions  */
   const onClose = () => {
    //setIsKYCOpen(true); // First, trigger the professional KYC form
    //reset all the pay variables 
    setGpayAmount(0);
    setGpayOrderId(0);
    setGpayCustomer(null);
    setIsTrialGooglePayOpen(false); // trigger the professional google pay  form
};

  return (
    <PageContainer>
      <PageHeader
        title="Checkout"
        subtitle="Complete your order"
      />

      {/* Back to Cart */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Delivery & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={deliveryInfo.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={deliveryInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={deliveryInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="10001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                Payment Method
              </h2>

             {!auth?.token ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please login to continue with payment
                  </p>
                  <Button
                    onClick={() => navigate('/login', { state: '/checkout' })}
                  >
                    Login to Continue
                  </Button>
                </div>
              ) :   cart?.length ? (
                <div>
                   <ReduxProvider>
                     <ModalProvider> 
                  <RazorPayButton amount={calculateTotal()} handleRazorPayOrderAndButton={handleRazorPayOrderAndButton} currency="INR" receipt ={`razor_receipt_${getTimeSeriesFormattedTimeKey()}  `} description =" "   onToken={ async (token )=> { 
                    console.log("gpay token generated "+ JSON.stringify(token))
                    onClose();
                    
                   }}/>
                    {/* Amount Section 
                      <div className="p-10 text-center">
                        <span className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">Payable Amount</span>
                        <div className="text-5xl font-black text-slate-900 mt-3 mb-10">
                          ₹{calculateTotal()}
                        </div>*/}
                        {/*  }
                        <motion.a
                          href={merchantUpiLink}
                          onClick={handlePaymentClick}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all mb-6"
                        >
                          Pay with Any UPI App <ArrowRight size={20} />
                        </motion.a>
                     */}
                        {/* 
                          <PaymentComponent amount={amount} currency="USD" onToken={ async (token )=> { 
                                  console.log(" PaymentComponent "+ JSON.stringify(token))
                        }}/>  */}
                   
                      
                      {/* <GPayButton amount={1} currency="INR" onToken={ async (token )=> { 
                                  console.log("gpay token generated "+ JSON.stringify(token))
                        }}/> */}
                        {/*   <GPayButtonRazor  amount={amount} currency="INR" onToken={ async (token )=> { 
                                  console.log("GPayButtonRazor  "+ JSON.stringify(token))
                        }} />*/}

                       {/*  <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-wider">
                          <ShieldCheck size={16} />
                          NPCI Verified Merchant
                        </div>
                      </div> */} 
                     {/**   <AnimatePresence>
                        {showDesktopQR && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center px-4 py-6 sm:p-8"
                          >
                            <button 
                              onClick={() => setShowDesktopQR(false)}
                              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-100 rounded-full"
                            >  
                              <X size={20} />
                            </button>
                                
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Scan to Pay</h3>
                             
                            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Open GPay, PhonePe, or Paytm on your phone</p>

                            <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-inner mb-6">
                               <div className="w-full flex justify-center">
                                  <QRCodeSVG 
                                      value={merchantUpiLink} 
                                      size={isMobile ? 180 : 220} 
                                      level="H" 
                                      includeMargin={true} 
                                  />
                                  </div>
                            </div>
                             
                            <div className="flex items-center gap-2 text-amber-600 font-mono font-bold bg-amber-50 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm">
                              <Clock size={16} />
                              Link expires in {formatTime(timeLeft)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence> */}
                   </ModalProvider> 
                   </ReduxProvider>
                   { clientToken && cart?.length ? (
                      <div>
                       {/*<PaymentContainer parentInstance={instance} parentClientToken={clientToken} parentSetInstance ={setInstance}/> */} 
                       {/**   <DropIn
                          options={{
                            authorization: clientToken,
                            paypal: {
                              flow: 'vault',
                            },
                          }}
                          onInstance={(instance) => setInstance(instance)}
                        />
                        
                        <div id="paypal-container-ZN82WD4CHVC8Y"></div>*/}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                      
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                 
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}

            {/*  {!auth?.token ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please login to continue with payment
                  </p>
                  <Button
                    onClick={() => navigate('/login', { state: '/checkout' })}
                  >
                    Login to Continue
                  </Button>
                </div>
              ) : clientToken && cart?.length ? (
                <div>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: 'vault',
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}

              */}

              {/* Security badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                 <div className="p-6">
                        {/* PayPal Hosted Button Component */}
                           <PayPalButtonOrderIdSingle handlePayPalOrderAndButton={handlePayPalOrderAndButton} totalAmount={calculateTotal()} />
                          </div>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    24/7 Support
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-600" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {calculateShipping() === 0 ? 'FREE' : formatCurrency(calculateShipping())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculateTax())}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleCheckout}
                disabled={!auth?.token || !instance || loading || !cart?.length}
                loading={loading}
                className="w-full mt-6"
                size="lg"
              >
                {loading ? 'Processing...' : `Place Order • ${formatCurrency(calculateTotal())}`}
              </Button>

              {/* Terms */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}