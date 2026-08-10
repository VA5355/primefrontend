import React from 'react';
import GooglePayButton from '@google-pay/button-react';

function GPayButtonRazor({amount = "2499.00", currency="INR " , onToken}) {
   // let merchantVPA = '7588230462@okbizaxis';
  // let merchantName = 'Store%20Notify';
 let merchantVPA = '5532602176';
   let merchantName = 'StoreNotify';


  return (
    <GooglePayButton
      environment="TEST" // Switch to "PRODUCTION" when live
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
        },
      }}
      onLoadPaymentData={paymentRequest => {
        // Send token to your backend for payment processing
        console.log('GPayButtonRazor Success', JSON.stringify(paymentRequest));

      }}
      onError={error => console.error('Error', error)}
    />
  );
}
export default GPayButtonRazor;
