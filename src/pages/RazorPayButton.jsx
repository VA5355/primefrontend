//🧩 4. React Component (RazorPayButton.tsx)
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useAuth } from '../context/auth';
import { useState  } from 'react';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createOrder } from "../redux/slices/paymentSlice";
//import { RootState } from "@/redux/store";
import { useCart } from '../context/cart';
import { useRazorpay } from "../redux/hooks/useRazorpay";
 import { useModal } from '../providers/ModalProvider';
import { showModal as modalShow, showError } from '../components/common/service/ModalService';
 import {StorageUtils} from "../libs/cache";
import {CommonConstants, isNullOrUndefined} from "../utils/constants";
import { REACT_APP_RAZORORDERANDPAYMENTURL } from '../libs/client';

/*
* Sample cart 
 * [{"id":"55876c92-913c-4199-98ab-bca223a4f005","name":"Kate Spade Tote","slug":"kate-spade-tote",
 * "description":"Large leather tote bag.","price":"358.99","quantity":20,"sold":15,
 * "photoPath":"/uploads/products/kate-spade-tote-1757862445657.jpg","photoContentType":"image/jpeg",
 * "shipping":true,"categoryId":"090be721-a44b-4090-bdfb-d4b487e85980","createdAt":"2026-07-18T00:45:26.437Z",
 * "updatedAt":"2026-07-18T00:47:30.072Z","category":{"id":"090be721-a44b-4090-bdfb-d4b487e85980",
 * "name":"Clothing & Accessories","slug":"clothing-accessories"}}]
 * 
 
*/
const RazorPayButton = ({amount = "2499.00", currency="INR " ,receipt ,description, handleRazorPayOrderAndButton,  onToken}) => {
  const dispatch = useDispatch();
  let keyRazor = "2853QGpWUiQAri"
   const [auth] = useAuth();
    // Form states
     const [deliveryInfo, setDeliveryInfo] = useState({
       fullName: auth?.user?.name || '',
       email: auth?.user?.email || '',
       phone: auth?.user?.phone || '',
       address: auth?.user?.address || '',
       city: '',
       postalCode: '',
       country: 'India'
     });
     const [defaultFailedOrder, setDefaultFailedOrder] = useState({
       orderType : "razor",   // razor or gpaydirect (by scanning )
        amt:   "" , // "1",
        

          cur: "" , // "INR",
        recpt: "" , //  "razor_receipt_2026-03-04 18:04:44  ",
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


  const { order, loading } = useSelector(
    (state) => state.razorpay
  );
   const { showFramerModal, hideModal } = useModal();
     const [cart, setCart] = useCart();
  const navigate = useNavigate();
   let spinnerIsAvailable = false;


  const { openRazorpay } = useRazorpay();
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
  const handlePayment = async () => {

   try {
       let descriptionAct = "Cart initiated at "+ getShortDateTime()+" by "+ getDeliveryToUserDetails();
         let   nonce  = 0;
      try {

        // First create the parent i.e. Checkout JSX Razor Pay Order 
        // then pass it to Brain tree or Razor Pay 
        if (handleRazorPayOrderAndButton !==undefined){
           console.log(" Razor Button calling Checkout JSX handleRazorPayOrderAndButton for  Order placement ...  " );  
          await handleRazorPayOrderAndButton()
            // setLoading(true);
               const baseUrl =
                 ( window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
                    ?  `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL}`
                : `${process.env.REACT_APP_RAZORORDERANDPAYMENTURL}`;
              //   const { nonce } =  await Promise.resolve(description)  // this does not set the nounce
             //  const   nonce  =   (descriptionAct)    /// descriptive does not work lets try some one time numeric number 
            const num = Math.floor(1000000000 + Math.random() * 9000000000); // cannot start with 0 
              // const num = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
                  console.log('nonce :: ' +num); // Example: 4820519374
                        nonce  = num;
                  console.log("STARTED BRAIN TREE Order placement ...  " );  
                  toast.success(' Try to place order through Brain Tree  ');
                  // Drop in Tag takes care of this 
                /*  await axios.post(`${baseUrl}/api/braintree/payment`, {
                    nonce,
                    cart,
                    deliveryInfo
                  });

                // localStorage.removeItem('cart');
                // setCart([]);
                  toast.success('Order placed Brain Tree successfully!');
                  */
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
              // 🚨 Extra safety: Razorpay requires minimum 100 paise
             /* if (Number(order.amount) < 100) {
                console.error("Amount too low:", order.amount);
                setDefaultFailedOrder( befOrder => { 
                     befOrder.amount = payload.amount;
                befOrder.currency = payload.currency;
                befOrder.receipt = payload.receipt;
                befOrder.n2 = payload?.description || order?.error || 'Order Amount too low'  ;
                return befOrder;
                })
                 
                 let razorPayOrder = { show: true, modalType : "razorpayorder" , ...defaultFailedOrder}
                dispatch(modalShow({title: 'Payment Order', message: "Amount must be at least ₹1",  payload : razorPayOrder} ));
                return;
              }*/
              //const { currency :any as razcurrency , amount :any as razamount } = order.payment;
              const { 
                  currency: razcurrency = 'INR'  , 
                  amount: razamount 
                } = order.payment;
              console.log("Order validated. Opening Razorpay:", order.id);
              /* ORDER from Neon TEch DBentry 
              {
                      "payment": {
                          "amount": "18397.70",
                          "paymentMethodNonce": "RazorButton",
                          "options": {
                              "submitForSettlement": true
                          }
                      },
                      "buyerId": "b4017833-1ecf-433b-ab24-30f4ec02b8f2",
                      "status": "Processing",
                      "products": [
                          {
                              "id": "c7fa242f-3c9f-44c8-8143-56d8dde3f74a",
                              "name": "Organic Coffee Beans 5lb",
                              "slug": "organic-coffee-beans-5lb",
                              "description": "Single origin arabica beans.",
                              "price": "79.99",
                              "quantity": 230,
                              "sold": 156,
                              "photoPath": "/uploads/products/organic-coffee-beans-5lb-1757862518697.jpg",
                              "photoContentType": "image/jpeg",
                              "shipping": true,
                              "categoryId": "be2bcd78-b744-4647-8442-90561a39706a",
                              "createdAt": "2026-07-18T00:45:46.860Z",
                              "updatedAt": "2026-07-18T00:47:36.776Z",
                              "category": {
                                  "id": "be2bcd78-b744-4647-8442-90561a39706a",
                                  "name": "Food & Beverages",
                                  "slug": "food-beverages"
                              }
                          }
                      ],
                      "buyer": {
                          "id": "b4017833-1ecf-433b-ab24-30f4ec02b8f2",
                          "name": "George",
                          "email": "glaubhanta@gmail.com",
                          "password": "$2b$12$yvL0FmySXYeUSnL6aPVA6utZoQ3EPKmh9513/fx2qKm03MqsfpFOK",
                          "address": null,
                          "role": 0,
                          "resetPasswordToken": null,
                          "resetPasswordExpires": null,
                          "createdAt": "2026-07-20T00:27:45.501Z",
                          "updatedAt": "2026-07-20T00:27:45.501Z"
                      },
                      "id": "e97d0f2b-d23d-4367-9671-d78e0f292ac4",
                      "createdAt": "2026-07-26T21:01:27.976Z",
                      "updatedAt": "2026-07-26T21:01:27.976Z"
                  }
              */
                // 1. Destructure the order ID (renamed to receipt) and products array
              const { 
                id: receipt = 'Sale order issued Prime Computers', 
                products = [] 
              } = order || {};

              // 2. Map through products to combine their descriptions, with a fallback default
              const razdescription = Array.isArray(products) && products.length > 0
                ? products
                    .map(product => product?.description?.trim())
                    .filter(Boolean) // Remove empty/null descriptions
                    .join(' | ')     // Join with separator (e.g., "Single origin arabica beans. | ...")
                : 'Set of products sales Prime Computers';

              console.log({ receipt, razdescription });

              // NOTE that razor order needs amount currency 
              let creatRazorOrder = { 
                 id: order.id,
                buyerId :      order?.buyer?.id,
                 amount: razamount > 100 ? 100 : 100,   /// for testing keep rupee 1 only default amount 
                  currency: razcurrency,
                  receipt: receipt,
                  location: "en-IN",
                  description: razdescription,
                   razorpayOrderId:   razorpayOrder?.id
              }

              // ✅ Only now open Razorpay
              await openRazorpay(creatRazorOrder,deliveryInfo, `rzp_test_${keyRazor}`, dispatch).then( comp => {
                  let razorPayOrder = { show: true, modalType : "razorpayorder" , ...creatRazorOrder}
                    // razorPayOrder = { ...razorPayOrder , order };
                    //, type:'info', payload : razorPayOrder
                /*
                  razorpayorder = {
                  orderType : "",   // razor or gpaydirect (by scanning )
                  amt:   "" , // "1",
                  

                    cur: "" , // "INR",
                  recpt: "" , //  "razor_receipt_2026-03-04 18:04:44  ",
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


                }
                */
                    console.log(`razorPayOrder ${JSON.stringify(razorPayOrder)} `)
                    StorageUtils._save('razorpayorder_recent',razorPayOrder);
                 //immediately set the localstorage razorpayorderstatus 
                 // so that Checkout JSX waiting through timeout immediate moves back to or navigates or refresh 
                 // to state where the Razor Pay or Brain tree  drop in is not visible 
                   localStorage.setItem('razorpayorderstatus','success');

                  dispatch(modalShow({title: 'Payment Order', message: `Your Order is proceesed :: ${order.id} ` ,payload : razorPayOrder} ));
                  onToken?.(order)
                  })
                  .catch(perr => {

                      dispatch(modalShow({title: 'Payment Order', message: "Please follow-up with support \n order id :: "+order.id , } ));
                  });
                  // once above is completed then show ORDER placed Payment in Processing
                    //openRazorpay(res.payload, `rzp_test_${keyRazor}`, dispatch);
          }




        }
       
         
       
        } catch (err) {
          console.error(err);
          toast.error('Order placed Brain Tree failed. Please try again.');
        } 
      
     } catch (err) {
        console.error("Payment flow error:", err);
       dispatch(modalShow({ title: 'Payment Order', message: `Something went wrong while initiating payment. `, } ));
       // alert("Something went wrong while initiating payment.");
    }


  };

  return (
    <button
      onClick={handlePayment} 
      className="bg-blue-600 text-white px-4 py-2 rounded razorbutton"
      disabled={loading}
    > {/** bg-green-600 */}

<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="svelte-ekc7fv">
 <path d="M7.077 6.476l-.988 3.569 5.65-3.589-3.695 13.54 3.752.004 5.457-20L7.077 6.476z" fill="#fff" className="svelte-ekc7fv">
  </path>
   <path d="M1.455 14.308L0 20h7.202L10.149 8.42l-8.694 5.887z" fill="#fff" className="svelte-ekc7fv"></path>
   </svg> 
    



      {loading ? "Processing..." : "Pay Razor"}

        <div className="PaymentButton-contents svelte-ekc7fv">
     <span className="PaymentButton-text svelte-ekc7fv">TipStore</span>
      <div className="PaymentButton-securedBy svelte-ekc7fv">Secured by Razorpay</div>
      
      </div>
    </button>
  );
};

export default RazorPayButton;
//________________________________________
