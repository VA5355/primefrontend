import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard, MapPin, User, Mail, Phone, Home,
  ShoppingCart, ArrowLeft, Shield, Truck, Clock, X, ChevronRight, CheckCircle2, QrCode
} from 'lucide-react';
import { AlertTriangle,  RefreshCw } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Smartphone } from 'lucide-react';

import { createOrder } from "../redux/slices/paymentBharatPeSlice";
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import GPayButton from './GPayButton';
import GPayButtonRazor from './GPayButtonRazor';
//import BharatPePaymentModal from './BharatPePaymentModal';
//import BharatPePaymentModal from './BharatPePaymentModalExpire';
import BharatPePaymentModal from './BharatPePaymentModalPolling';
import QrCodeExpiredModal from './QrCodeExpiredModal';
import GooglePayButton from '@google-pay/button-react';
import { showModal as modalShow, showError } from '../components/common/service/ModalService';
import { useModal } from '../providers/ModalProvider';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';

// UPI Link generator
const merchantUpiId = "primecomputerwakad-4@okaxis"; 
const merchantName = "Prime Computer Network";
const merchantUpiId2 = "throuvinodmalviya74@yblgh"; 

const STORAGE_KEY = 'active_bharatpe_order';

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
     const dispatch = useDispatch();
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [loadingBharatPe, setLoadingBharatPe] = useState(false);
  const [activeOrderData, setActiveOrderData] = useState(null);
  const [responseState, setResponseState] = useState(null);
    const [defaultFailedOrder, setDefaultFailedOrder] = useState({
       orderType : "bharatpe",   // bharatpe or gpaydirect (by scanning )
        amt:   "" , // "1",
        

          cur: "" , // "INR",
        recpt: "" , //  "bharatpe_receipt_2026-03-04 18:04:44  ",
          n1:"en-IN",
        n2:"Life time subscription virtual tradning @onedinaar.com  ",
        show : true,
          amount: '',
          amount_due: '',
        amount_paid: '', 
        created_at : '', 
        currency : '', 
        id: '', 
        notes : { 
          key1 : "",
          key2 : "", 

        }, 
        offer_id : '', 
        receipt: '', 
        status : '', 

     });

  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
     const { showFramerModal, hideModal } = useModal();
  const navigate = useNavigate();

  const [buttonColor, setButtonColor] = useState("default");
  const [buttonType, setButtonType] = useState("buy");
  const [buttonSizeMode, setButtonSizeMode] = useState("static");
  const [buttonWidth, setButtonWidth] = useState(240);
  const [buttonHeight, setButtonHeight] = useState(40);

  // Form states
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  // Modal Flow States
  const [gpayamount, setGpayAmount] = useState(0);
  const [gpaymentRequest, setGpaymentRequest] = useState(0);

  const [isTrialGooglePayOpen, setIsTrialGooglePayOpen] = useState(false);
  const [isFailedGooglePayOpen, setIsFailedGooglePayOpen] = useState(false);
  const [isFailedPhonePeOpen, setIsFailedPhonePeOpen] = useState(false);
  const [showDesktopQR, setShowDesktopQR] = useState(false);
  const [showDesktopBharatPeQR, setShowDesktopBharatPeQR] = useState(false);

  const [isBharatPeModalOpen, setIsBharatPeModalOpen] = useState(false);

  const [merchantUpiLinkBharatPe, setMerchantUpiLinkBharatPe] = useState('');
  const [selectedApp, setSelectedApp] = useState('all');

  // Timer & UTR Step States
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isMobile, setIsMobile] = useState(false);
  const [showUtrStep, setShowUtrStep] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  const UPI_APPS = [
    { id: 'all', name: 'Generic UPI', color: 'bg-indigo-600', badge: 'All Apps' ,merchantUpiId: merchantUpiId, merchantUpiLink:`upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR` },
    { id: 'gpay', name: 'Google Pay', color: 'bg-blue-600', badge: 'GPay',merchantUpiId: merchantUpiId, merchantUpiLink:`upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR` },
    { id: 'paytm', name: 'Paytm', color: 'bg-sky-500', badge: 'Paytm' ,merchantUpiId: merchantUpiId, merchantUpiLink:`upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR` },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600', badge: 'PhonePe',merchantUpiId: merchantUpiId2, merchantUpiLink:`upi://pay?pa=${merchantUpiId2}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR` },
  ];
  const qrDimensions = isMobile ? 180 : 200;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    paymentRequest['transactionInfo'].totalPrice = total;
    setGpaymentRequest((req) => { 
      req = paymentRequest;
      req.transactionInfo.totalPrice = total;
      return req;
    });
    // Load existing order from storage on component mount
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        const expiresAt = new Date(parsed?.bharatPeOrderNew?.data?.expires_at).getTime();
        
        // If order hasn't expired yet, retain it in state
        if (expiresAt > Date.now()) {
          setActiveOrderData(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!cart?.length) {
      navigate('/cart');
      return;
    }
    if (auth?.token) {
      setDeliveryInfo({
        fullName: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || '',
        city: '',
        postalCode: '',
        country: 'India'
      });
    }
  }, [auth?.token, cart?.length, navigate]);

  useEffect(() => {
    let timer;
    if (showDesktopQR && !showUtrStep && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showUtrStep) {
      setShowUtrStep(true);
    }
    return () => clearInterval(timer);
  }, [showDesktopQR, showUtrStep, timeLeft]);
  useEffect(() => {
   // let timer;
    if (showDesktopBharatPeQR && orderData  ) {
         console.log("Checkout-withBharatPe useEffect::  the BharatPe Backend Order creation call back with UPI Link  ")
   //   timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else    {  //if (timeLeft === 0 && !showUtrStep)
      //setShowUtrStep(true);
      console.log("Checkout-withBharatPe useEffect:: Could not catch the BharatPe Backend Order creation call back ")
    }
    //return () => clearInterval(timer);
  }, [showDesktopBharatPeQR ]);
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



  const calculateSubtotal = () => cart.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0);
  const calculateShipping = () => (calculateSubtotal() > 100 ? 0 : 10);
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();
  const subtotal = cart.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  let spinnerIsAvailable = false;

  const paymentRequest = useMemo(() => {
    return { 
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"]
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example"
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: "BCR2DN4TVC6MZZST",
        merchantName: "StoreNotify",
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPriceLabel: "Total",
        totalPrice: "100.00",
        currencyCode: 'INR',
        countryCode: 'IN',
      }
    };
  }, [total]);
  const initiateVyaparOrder = async () => {
    setLoading(true);
    setError(null);
      let descriptionAct = "Cart initiated at "+ getShortDateTime()+" by "+ getDeliveryToUserDetails();
         let   nonce  = 0;
      let bharatPeReceivedOrder = undefined;
    try {                       // /api/vyapar/create-order' this will be called from the controller in the node js backend 
          console.log("  calling Checkout JSX Bharat Pe  for  Order placement ...  " );  
          const num = Math.floor(1000000000 + Math.random() * 9000000000); // cannot start with 0 
          console.log('nonce :: ' +num); // Example: 4820519374
          nonce  = num;  
          console.log("STARTED Bharat Pe Order placement ...  " ); 
          let bharatpe32chars = "bharatpe_"+deliveryInfo.email+"_"+nonce;
          let finalName = bharatpe32chars.slice(0,32);
          let sanitizedName = bharatpe32chars.replace(/[^a-zA-ZÀ-ÿ0-9\s&\-'.()]/g, '');
          finalName = sanitizedName.slice(0, 32);
          const payload = {
            name : finalName,   //+deliveryInfo.email+"_"+getShortDayWithSeconds(),
            amount:  calculateTotal(),// amount,
            currency: 'INR', //currency,
            receipt: "bharatpe_receipt_"+getTimeSeriesFormattedTimeKey(),
            location: "en-IN",
            description: descriptionAct,
            nonce: nonce,
            cart : cart,
            deliveryInfo: deliveryInfo,
            p_info: 'Purchase at Prime Computer Network',
            customer_name: deliveryInfo?.fullName || 'Customer',
            customer_mobile: deliveryInfo?.phone || '9876543210',
            customer_email: deliveryInfo?.email || 'customer@primecomputernetwork.com',
            cart_id: cart?.[0]?.id || 'cart-42'
         };
          showFramerModal({ status: 'loading', 
                      message: ` Bharat Pe... ` 
                  }); 
         spinnerIsAvailable = true;
         const res = await dispatch(createOrder(payload));
         (spinnerIsAvailable ?   setTimeout( () => { hideModal() 
                                                      spinnerIsAvailable =false;
                                                  } , 1000): console.log("Spinner unavailavle to close ") ) ; 
         console.log("Checkout-withBharatPe dispatch createOrder res "+JSON.stringify(res));
   
         if (res.payload) {
            console.log("Checkout-withBharatPe inside if (res.payload) ");


            if (res.payload?.isGatewayError !== undefined) {
              // Local DB persisted, Gateway failed
              setResponseState({
                type: 'GATEWAY_ERROR',
                orderId: res.payload.bharatPeOrder.id,
                message: res.payload.message,
                technicalDetails: res.payload.gatewayError
              });
              setLoadingBharatPe(true);

            } else {
               console.log("Checkout-withBharatPe inside if (res.payload.isGatewayError)  else ");
                // Complete Success
                setResponseState({
                  type: 'SUCCESS',
                  orderId: res.payload.bharatPeOrder.id,
                  paymentData: res.payload.bharatPeOrderNew
                });

              // Redux Toolkit safe extraction
                const order = res?.payload?.bharatPeOrder;
                const bharatPeOrder = res?.payload?.bharatPeOrderNew;
                 console.log("Checkout-withBharatPe  order :: res?.payload?.bharatPeOrder    "+JSON.stringify(order));
                 console.log("Checkout-withBharatPe  bharatPeOrder :: res?.payload?.bharatPeOrderNew    "+JSON.stringify(bharatPeOrder));
                // 🚨 HARD VALIDATION
                if (!order || !order.id || !order.buyerId || !order.createdAt) {
                          console.error("Invalid order response:", order);
                                // Extract the target error object or payload
                        const errorData = order?.error || order;
                        // Helper function to find the first non-empty text value across any key
                        const extractErrorMessage = (obj )  => {
                          if (!obj) return null;
                          // If it's already a plain non-empty string, return it
                          if (typeof obj === 'string' && obj.trim() !== '') {
                            return obj.trim();
                          }
                          // If it's an object, iterate through its keys
                          if (typeof obj === 'object') {
                            for (const key of Object.keys(obj)) {
                              const val = obj[key];
                              // Recursively check nested strings or objects
                              const foundText = extractErrorMessage(val);
                              if (foundText) {
                                return foundText;
                              }
                            }
                          }
                          return null;
                        };
                          // Find the text message or fall back to default
                        const extractedMessage = extractErrorMessage(errorData) || "Order failed";
                          setDefaultFailedOrder( befOrder => { 
                              befOrder.amount = payload.amount;
                          befOrder.currency = payload.currency;
                          befOrder.receipt = payload.receipt;
                          befOrder.n2 = payload?.description || extractedMessage || 'Order Generation Failed' ;
                          return befOrder;
                          })
                          //immediately set the localstorage bharatpeorderstatus 
                          // so that Checkout JSX waiting through timeout immediate moves back to or navigates or refresh 
                          // to state where the Bharay Pey or Brain tree  drop in is not visible 
                            localStorage.setItem('bharatpeorderstatus',extractedMessage || 'Order Generation Failed');
    
                            let razorPayOrder = { show: true, modalType : "bharatpeorder" , ...defaultFailedOrder}
                          dispatch(modalShow({title: 'Payment Order', message: "Payment initialization failed. Please try again.", payload : razorPayOrder} ));
                          return;
                  }
               } // SUCCESS VVYAPAR create order with BharatPe 

         }
       
        /** NOW here follow the RazorButton dispatcher approach  */
        /*
        
             const num = Math.floor(1000000000 + Math.random() * 9000000000); // cannot start with 0 
                      // const num = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
                          console.log('nonce :: ' +num); // Example: 4820519374
                                nonce  = num;
                          console.log("STARTED BRAIN TREE Order placement ...  " );  
                          toast.success(' Try to place order through Brain Tree  ');
                          // Drop in Tag takes care of this 
                   
                        //  navigate('/dashboard/user/orders');
                      let razor32chars = "razor_"+deliveryInfo.email+"_"+nonce;
                      let finalName = razor32chars.slice(0,32);
                      // 2. Strip out all characters NOT allowed by your regex
                        // [^a-zA-ZÀ-ÿ0-9\s&\-'.()] matches any single character outside your allowed list
                        let sanitizedName = razor32chars.replace(/[^a-zA-ZÀ-ÿ0-9\s&\-'.()]/g, '');
        
                      // 3. Slice to 32 characters AFTER sanitization to ensure final string length
                        finalName = sanitizedName.slice(0, 32);
        
                      const payload = {
                        name : finalName,   //+deliveryInfo.email+"_"+getShortDayWithSeconds(),
                        amount: amount,
                        currency: currency,
                        receipt: receipt,
                        location: "en-IN",
                        description: descriptionAct,
                        nonce: nonce,
                        cart : cart,
                        deliveryInfo: deliveryInfo
                      };
                      showFramerModal({ 
                                  status: 'loading', 
                                  message: ` Razor Pay... ` 
                                  }); 
                                spinnerIsAvailable = true;
                      const res = await dispatch(createOrder(payload));
                            (spinnerIsAvailable ?   setTimeout( () => { hideModal() 
                                                      spinnerIsAvailable =false;
                                                  } , 1000): console.log("Spinner unavailavle to close ") ) ; 
        
                 if (res.payload) {
           
                  // Redux Toolkit safe extraction
                    const order = res?.payload?.razorOrder;
                    const razorpayOrder = res?.payload?.razorpayOrder;
         
                   // 🚨 HARD VALIDATION
                   if (!order || !order.id || !order.buyerId || !order.createdAt) {
                              console.error("Invalid order response:", order);
                                    // Extract the target error object or payload
                            const errorData = order?.error || order;
                            // Helper function to find the first non-empty text value across any key
                            const extractErrorMessage = (obj )  => {
                              if (!obj) return null;
                              // If it's already a plain non-empty string, return it
                              if (typeof obj === 'string' && obj.trim() !== '') {
                                return obj.trim();
                              }
                              // If it's an object, iterate through its keys
                              if (typeof obj === 'object') {
                                for (const key of Object.keys(obj)) {
                                  const val = obj[key];
                                  // Recursively check nested strings or objects
                                  const foundText = extractErrorMessage(val);
                                  if (foundText) {
                                    return foundText;
                                  }
                                }
                              }
                              return null;
                            };
                              // Find the text message or fall back to default
                            const extractedMessage = extractErrorMessage(errorData) || "Order failed";
                              setDefaultFailedOrder( befOrder => { 
                                  befOrder.amount = payload.amount;
                              befOrder.currency = payload.currency;
                              befOrder.receipt = payload.receipt;
                              befOrder.n2 = payload?.description || extractedMessage || 'Order Generation Failed' ;
                              return befOrder;
                              })
                              //immediately set the localstorage razorpayorderstatus 
                              // so that Checkout JSX waiting through timeout immediate moves back to or navigates or refresh 
                              // to state where the Razor Pay or Brain tree  drop in is not visible 
                                localStorage.setItem('razorpayorderstatus',extractedMessage || 'Order Generation Failed');
        
                                let razorPayOrder = { show: true, modalType : "razorpayorder" , ...defaultFailedOrder}
                              dispatch(modalShow({title: 'Payment Order', message: "Payment initialization failed. Please try again.", payload : razorPayOrder} ));
                              return;
                      }
        */
     /* const response = await axios.post('/bharatpeorder/create', {
        amount: amount,
        p_info: 'Purchase at Prime Computer Network',
        customer_name: deliveryInfo?.fullName || 'Customer',
        customer_mobile: deliveryInfo?.phone || '9876543210',
        customer_email: deliveryInfo?.email || 'customer@primecomputernetwork.com',
        cart_id: cart?.[0]?.id || 'cart-42'
      });
      */ 
      // as per  const mergedBharatPeOrder = { bharatPeOrder: dbOrder, bharatPeOrderNew };
      // in the bharatpe.service  
      let response =  res.payload;
      if (response?.bharatPeOrder && response.bharatPeOrderNew) { //  && response.data.data
        console.log(' response.bharatPeOrder '+JSON.stringify(response.bharatPeOrder))
        console.log(' response.bharatPeOrderNew '+JSON.stringify(response.bharatPeOrderNew))
       // console.log(' response.data.data  '+JSON.stringify(response.data.data))
        setOrderData(response.bharatPeOrderNew);
        bharatPeReceivedOrder = Object.assign({},response.bharatPeOrderNew);
        setActiveOrderData(bharatPeReceivedOrder);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bharatPeReceivedOrder));
      } else {
        setError('Unable to generate payment QR. Please try again.');
        setResponseState({
          type: 'GATEWAY_ERROR',
          orderId: response?.bharatPeOrder?.id || 'N/A',
          technicalDetails: response?.msg || 'Gateway response invalid'
        });
      }
    } catch (err) {
      console.error('Vyapar Gateway Creation Error:', err);
      setError('Connection error with payment gateway.');
      setResponseState({
        type: 'GATEWAY_ERROR',
        orderId: 'N/A',
        technicalDetails: err.message
      });
    } finally {
      setLoading(false);
    }
    return bharatPeReceivedOrder ;
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    return required.every(field => deliveryInfo[field]?.trim()) && deliveryInfo?.country === 'India';
  };

  const handlePlaceOrderClick = () => {
    if (!isFormValid()) {
      toast.error('Please complete all delivery fields and select India as Country.');
      return;
    }
    if (!isPaymentConfirmed) {
      toast.error('Please confirm the payment checkbox.');
      return;
    }
    setGpayAmount(calculateTotal());
    setIsTrialGooglePayOpen(true);
  };

  const handlePayWithUPI = () => {
    // make the 
    setIsTrialGooglePayOpen(false);
    setTimeLeft(300);
    setShowUtrStep(false);
    setShowDesktopQR(true);
  };
  const handlePayWithBharatPeUPI = async () => {

    // 1. Check if we already have an unexpired order in memory/storage
    if (activeOrderData) {
      const expiresAt = new Date(activeOrderData?.data?.expires_at).getTime();
        console.log('Checkout-withBharatPe  existing bharat pe create order exists   ')
      //if (expiresAt > Date.now()) {
       // return; // Reuse existing order without triggering API call
      //}
    }
    if ( !orderData) {
      await initiateVyaparOrder().then(bharatPeOrder => { 
        console.log("await initiateVyaparOrder  "+JSON.stringify(bharatPeOrder))
        if(bharatPeOrder ){ 
        console.log('Checkout-withBharatPe bharat pe create order received after initiateVyaparOrder call ')
         setShowDesktopBharatPeQR(true); 
          setIsBharatPeModalOpen(true);
        }
        else {
         console.error('Checkout-withBharatPe  Vyapar Gateway bharat pe create order Creation  not set ' );
        }
      });
      
    
      }
     else if(activeOrderData){
           const expiresAt = new Date(activeOrderData?.data?.expires_at).getTime();
       // if (expiresAt > Date.now()) {
          // return; // Reuse existing order without triggering API call
           console.log('Checkout-withBharatPe  existing bharat pe create order   ')
         setShowDesktopBharatPeQR(true); 
          setIsBharatPeModalOpen(true);
        //}
       // }
      }
    setIsTrialGooglePayOpen(false);
    setTimeLeft(300);
    setShowUtrStep(false);
    
  };
  const handleClearOrder = () => {
    try { 
       console.log('Checkout component :: Checkout-withBharaPeModal handleClearOrder from BharatPePaymentModalPolling ')
       setActiveOrderData(null);
       localStorage.removeItem(STORAGE_KEY);

    }catch( cherr){ 

      console.log('Checkout :: Checkout-withBharaPeModal handleClearOrder component not available ')
    }
   
  };
  const openPhomePeIFrame = () => {
    if (window.PhonePeCheckout !== undefined) {
      try {  
        window.PhonePeCheckout.transact({ tokenUrl: "https://merchant-t2.phonepe.com/transact", phonePeOrderAndRedirect, type: "IFRAME" });
      } catch (pherr) {
        setIsFailedPhonePeOpen(true);
      }
    } else {
      setIsFailedPhonePeOpen(true);
    }
  };

  const sendPhonePeMessageServer = () => {
    toast.success('Message sent to Prime Computer Network Support.');
    setIsFailedPhonePeOpen(false);
  };

  const sendGooglePayMessageServer = () => {
    toast.success('Message sent to Prime Computer Network Support.');
    setIsFailedGooglePayOpen(false);
  };

  const completeOrderAndRedirect = (utrValue = '') => {
    const orderId = 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const txnParams = new URLSearchParams({
      order_id: orderId,
      amount: gpayamount,
      utr: utrValue,
      status: 'success'
    });
    
    setShowDesktopQR(false);
    navigate(`/customeronboarding?${txnParams.toString()}`);
  };

  const phonePeOrderAndRedirect = (utrValue = '') => {
    const orderId = 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const txnParams = new URLSearchParams({
      order_id: orderId,
      amount: gpayamount,
      utr: utrValue,
      status: 'success'
    });
    
    setShowDesktopQR(false);
    navigate(`/customeronboarding?${txnParams.toString()}`);
  };

  const upiString = orderData?.upi_string || '';
  const intentLinks = orderData?.upi_intent || {};



  return (
    <PageContainer>
      <PageHeader title="Checkout" subtitle="Complete your order" />

      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="fullName" value={deliveryInfo.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" value={deliveryInfo.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" name="phone" value={deliveryInfo.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select name="country" value={deliveryInfo.country} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800">
                    <option value="India">India</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input type="text" name="address" value={deliveryInfo.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" name="city" value={deliveryInfo.city} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input type="text" name="postalCode" value={deliveryInfo.postalCode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" /> Payment Confirmation
              </h2>
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaymentConfirmed}
                    disabled={!isFormValid()}
                    onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Confirm UPI & Address Details
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enable QR order generation upon address validation.
                    </p>
                  </div>
                </label>
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

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.cartQuantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.price * (item.cartQuantity || 1))}
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

              <Button
                onClick={handlePlaceOrderClick}
                disabled={!isFormValid() || !isPaymentConfirmed}
                loading={loading}
                className="w-full mt-6"
                size="lg"
              >
                {loading ? 'Processing...' : `Place Order • ${formatCurrency(calculateTotal())}`}
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Initial Portal Modal */}
      {isTrialGooglePayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button onClick={() => setIsTrialGooglePayOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">✕</button>
              <h3 className="text-lg font-semibold">Payment Portal</h3>
              <p className="text-xs text-blue-100">Prime Computer Network</p>
            </div>

            <div className="p-6 text-center space-y-4">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(gpayamount)}</p>

              {/* Google Pay Button */}
              <div className="flex justify-center">
                <GooglePayButton
                  environment="PRODUCTION"
                  buttonColor={buttonColor}
                  buttonType={buttonType}
                  buttonSizeMode={buttonSizeMode}
                  paymentRequest={paymentRequest}
                  onLoadPaymentData={paymentRequest => {
                    console.log("load payment data", paymentRequest);
                  }}
                  onError={(error) => {
                    console.error('Google Pay Error:', error);
                  }}
                  style={{ width: buttonWidth, height: buttonHeight }}
                />
              </div>

              {/* PhonePe Button */}
              <button onClick={openPhomePeIFrame} className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-xl transition-colors">
                Pay with PhonePe →
              </button>

              {/* BharatPe Button */}
              <button 
                onClick={handlePayWithBharatPeUPI} 
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {/*  <QrCode className="w-5 h-5" /> */}{activeOrderData ? 'Resume BharatPe Payment' : ' Pay via BharatPe / QR →'}
               
              </button>

              {/* Generic UPI App Button */}
              <button onClick={handlePayWithUPI} className="w-full py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors">
                Pay with Any UPI App →
              </button>
            </div>
          </div>
        </div>
      )}
       {/** Bharat Pe Specific Modal with QRCode  */}
      {isBharatPeModalOpen && (  <> {/** <BharatPePaymentModal
        isOpen={isBharatPeModalOpen}
        onClose={() => setIsBharatPeModalOpen(false)}
        loading={loadingBharatPe}
        responseState={responseState}
        orderResponseData={orderData}
      /> */} 

      {activeOrderData !==null ? ( 
       <BharatPePaymentModal
        isOpen={isBharatPeModalOpen}
        onClose={() => setIsBharatPeModalOpen(false)}
        loading={loadingBharatPe}
        responseState={responseState}
        orderResponseData={orderData}  orderData={activeOrderData}
        onOrderExpired={handleClearOrder}
      />) : ( 
          <QrCodeExpiredModal 
            isOpen={isBharatPeModalOpen}
  onClose={() => console.log('QR Close')}
  orderId={orderData?.data?.order_id || responseState?.orderId}
  amount={orderData?.amount || orderData?.bharatPeOrder?.payment?.amount || '0.00'}
  onRetry={() => console.log('On Retry')}
          />
         
      )}
      
       </>
      
      )}
      {/* FailedGooglePay Portal Modal */}
      {isFailedGooglePayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button onClick={() => setIsFailedGooglePayOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">✕</button>
              <h3 className="text-lg font-semibold">Google Pay Portal</h3>
              <p className="text-xs text-blue-100">Prime Computer Network</p>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(gpayamount)}</p>
              <button onClick={sendGooglePayMessageServer} className="w-full py-3 bg-blue-700 hover:bg-blue text-white font-medium rounded-xl">
                Google Pay (Report Error)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FailedPhonePePortal Modal */}
      {isFailedPhonePeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button onClick={() => setIsFailedPhonePeOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">✕</button>
              <h3 className="text-lg font-semibold">Phone Pe Portal</h3>
              <p className="text-xs text-blue-100">Prime Computer Network</p>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(gpayamount)}</p>
              <button onClick={sendPhonePeMessageServer} className="w-full py-3 bg-blue-700 hover:bg-blue text-white font-medium rounded-xl">
                Phone Pe (Report Error)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal Popup */}
      <AnimatePresence>
        {showDesktopQR && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-800"
            >
              <button 
                onClick={() => setShowDesktopQR(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>

              {!showUtrStep ? (
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Scan to Pay</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4">Prime Computer Network</p>

                  <div className="flex items-center gap-2 mb-4 overflow-x-auto w-full justify-center py-1">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApp(app.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                          selectedApp === app.id 
                            ? `${app.color} text-white shadow-md scale-105` 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {app.badge}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-4 flex items-center justify-center">
                    <div 
                      className="relative flex items-center justify-center"
                      style={{ width: qrDimensions, height: qrDimensions }}
                    >
                      {UPI_APPS.map((app) => {
                        const isSelected = selectedApp === app.id;
                        return (
                          <motion.div
                            key={app.id}
                            initial={false}
                            animate={{
                              opacity: isSelected ? 1 : 0,
                              scale: isSelected ? 1 : 0.95,
                              zIndex: isSelected ? 10 : 0,
                            }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="absolute inset-0 flex items-center justify-center bg-white rounded-xl"
                            style={{
                              pointerEvents: isSelected ? 'auto' : 'none',
                            }}
                          >
                            <QRCodeSVG
                              value={app.merchantUpiLink}
                              size={qrDimensions}
                              level="H"
                              includeMargin={true}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-amber-600 font-mono font-bold bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 px-4 py-2 rounded-full text-xs sm:text-sm mb-3">
                    <Clock size={16} />
                    Expires in {formatTime(timeLeft)}
                  </div>

                  <button
                    onClick={() => setShowUtrStep(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                  >
                    Done scanning? Submit Payment Reference <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                    <CheckCircle2 size={20} />
                    Confirm Payment Details
                  </div>
                  
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-800 dark:text-white mb-1">
                      Enter 12-Digit UPI Ref / UTR / Txn ID
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Check your GPay, PhonePe, or Paytm debit message/history screen.
                    </p>
                    
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 421019827364"
                      value={utrNumber}
                      className="w-full px-4 py-3 font-mono text-lg tracking-wider border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={() => completeOrderAndRedirect(utrNumber)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
                    >
                      Submit Transaction Reference
                    </Button>

                    <button
                      type="button"
                      onClick={() => completeOrderAndRedirect()}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
