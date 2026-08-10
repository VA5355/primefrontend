//GPayButton.jsx 
import { m } from "framer-motion";
import React from "react";
import {useEffect , useRef } from "react";
import GooglePayButton from '@google-pay/button-react';
export default function GPayButton({amount = "2499.00", currency="INR " , onToken}){

   const btnRef =useRef(null);
   const loadingRef = useRef(false); // block couble-clicks
     // let merchantVPA = '7588230462@okbizaxis';
  // let merchantName = 'Store%20Notify';
 let merchantVPA = '5532602176';
   let merchantName = 'StoreNotify';


 useEffect( () => {
     
   // if(!window.google || !btnRef.current) return;
    if(!window.google) return;
    // Clear any previous append button (e.g, if props change )
  //  btnRef.current.innerHTML = "";
    const paymentsClient = new window.google.payments.api.PaymentsClient({

        environment : "TEST", // SWITCH to PRODUCTION LASTER 
    });
    console.log("GPayButton::  paymentsClient initi done ")
    const baseRequest = {appVersion:2 , appVersionMinor:0};
 
    // Include bith methods 
    const allowedAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
    const allowedCardNetworks  = ["AMEX", "DISCOVER","MASTER", "VISA"];

    const cardPaymentMethod ={ 
        type: "CARD",
        parameters: { allowedAuthMethods , allowedCardNetworks, billingAddressRequired : false },
        tokenizationSpecification:{
            type:"PAYMENT_GATEWAY",
            parameters:{
               // gateway:"cybersource",  // or your PSP 
              //  gatewayMerchantId:"qwerty123_1740741750" // replace with REAL 
                  gateway: 'razorpay', // Replace with your processor
                gatewayMerchantId: 'rzp_test_2853QGpWUiQAri',// 'YOUR_GATEWAY_MERCHANT_ID',

            },
        }
     };
      console.log("GPayButton::  cardPaymentMethod methods set  ")
    // Correct Payment names 
    const isReadyToPayRequest ={ ...baseRequest , allowedPaymentMethods:[  {
                type:"CARD",
                parameters: {allowedAuthMethods, allowedCardNetworks},
    }] }
    ; 
    paymentsClient.isReadyToPay(isReadyToPayRequest).then((res) => {
         if(!res?.result) return ;
         const button  =paymentsClient.createButton({
            buttonType:"buy",
            buttonSizeMode:"fill", // streached to the contatiner sixe 
            //action here i.e. tokenixatoin 
            onClick:async () => {
                    if(loadingRef.current) return;
                    loadingRef.current = true;
                    try{
                        const request = { ...baseRequest, allowedPaymentMethods:[cardPaymentMethod], merchantInfo :{merchantName:"Scriptapi"}, 
                                    transactionInfo: { totalPriceStatus :"FINAL", totalPrice :typeof amount ==="nunber"? amount.toFixed( 2):amount ,
                                        currencyCode:currency
                                    }};
                        const paymentData = await paymentsClient.loadPaymentData(request);
                           console.log("GPayButton::  paymentData  tokenization started  ")
                        // token is a JSNO STRING 
                        const tokenJson = paymentData.paymentMethodData.tokenizationData.token ;
                        const tokenObject  = JSON.parse(tokenJson);
                         console.log("GPayButton::  paymentData  tokenization success  ")
                        // for log or send to backend 
                        onToken?.(tokenObject)
                    }
                    catch(err){
                          // user cancelled or error ; Google Pay shows UI messages   
                            console.log("GPayButton::  loadPaymentData error  "+JSON.stringify(err))
                    }
                    finally{
                            loadingRef.current = false;
                    }
            }
         })
        // btnRef.current.appendChild(button);
         btnRef.current.replaceChildren(button);

    });
        console.log("GPayButton::  isReadyToPay initiated ...  ")
    // clean up on unmount 
    return () => {
        if( btnRef.current)
              btnRef.current.innerHTML = "";
    }



 }, [amount, currency, onToken]);


   return  <div ref={btnRef} style={{width: "100%" ,  height: 65}} > 
            <GooglePayButton   environment="TEST" // Switch to "PRODUCTION" when live
                         paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD', // Or UPI, based on gateway support
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'RUPAY'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'razorpay', // Replace with your processor
                gatewayMerchantId: 'rzp_test_2853QGpWUiQAri',// 'YOUR_GATEWAY_MERCHANT_ID',
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: merchantVPA,
          merchantName: merchantName,
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount,
          currencyCode: currency, // Required for India
          countryCode: 'IN',
        },  }} 
                          onLoadPaymentData={paymentRequest => {
        // Send token to your backend for payment processing
                            console.log('GPayButton embed google pay button onLoadPaymentData ', JSON.stringify(paymentRequest));
                            
                        }}
                        onToken={(tt) => {
                              console.log('GPayButton embed google pay button onToken ');
                             // for log or send to backend 
                                     onToken?.(tt)
                        }}
                        onError={error => console.error('Error', error)}
                        onReadyToPayChange={ (ch )=> {
                                console.log('GPayButton embed google pay button onReadyToPayChange ', JSON.stringify(ch));
                        }}
    />
        </div>  ;

}
