import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Receipt, 
  CreditCard,
  AlertCircle,
  X
} from 'lucide-react';
import axios from "axios";
import { 
  REACT_APP_BHARATPEORDERANDPAYMENTURL, 
  REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL, 
  REACT_APP_NGROKLOCALHOST 
} from '../libs/client';
import { useCart } from '../context/cart';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import usePageTitle from '../hooks/usePageTitle';

export default function VyaparBharatPeSuccess({
  amount = 150.50,
  apiKey = process.env.REACT_APP_VYAPAR_PROD_KEY
}) {
  usePageTitle('Payment Confirmation');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setCart] = useCart();

  // Extract query parameters correctly from the URL string:
  const queryOrderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
  const queryClientTxnId = searchParams.get('clientTxnId') || searchParams.get('client_txn_id') || searchParams.get('utr') || '';

  const [paymentStatus, setPaymentStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed' | 'timeout'
  const [orderDetails, setOrderDetails] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isChecking, setIsChecking] = useState(false);
  const [inOrderId, setInOrderId] = useState(queryOrderId);
  const [inClientTxnId, setInClientTxnId] = useState(queryClientTxnId);
  const [showModal, setShowModal] = useState(false);

  // Function to call Check Order Status API
  const checkOrderStatus = useCallback(async (targetOrderId, targetTxnId) => {
    // Prevent execution if parameters are missing
    if (!targetOrderId || !targetTxnId) {
      console.warn('Skipping API call: orderId or clientTxnId is missing.');
      return;
    }

    setIsChecking(true);
    try {
      const baseUrl =
        (window.location.hostname === `${REACT_APP_NGROKLOCALHOST}` || window.location.hostname === 'localhost')
          ? `${REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL}`
          : `${REACT_APP_BHARATPEORDERANDPAYMENTURL}`;

      // Axios call with parameters properly injected into the path
      const response = await axios.get(
        `${baseUrl}/api/bharatpeorder/vyaparstatus/${targetTxnId}/${targetOrderId}`,
        {
          params: { orderId: targetOrderId, clientTxnId: targetTxnId }
        }
      );

      // Axios automatically parses JSON into response.data
      const result = response.data;

      if (result.status && (result.data?.status === 'success' || result.data?.status === 'COMPLETED')) {
        setOrderDetails(result.data);
        setCreatedAt(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        setPaymentStatus('success');
      } else if (result.data?.status === 'failed' || result.data?.status === 'FAILURE') {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Sync state and run initial verification when searchParams change
  useEffect(() => {
    if (queryOrderId && queryClientTxnId) {
      console.log(`Fetched URL Query Params -> order_id: ${queryOrderId}, clientTxnId: ${queryClientTxnId}`);
      setInOrderId(queryOrderId);
      setInClientTxnId(queryClientTxnId);
      checkOrderStatus(queryOrderId, queryClientTxnId);
    } else {
      console.warn('Unable to read query params: order_id and clientTxnId');
    }
  }, [queryOrderId, queryClientTxnId, checkOrderStatus]);

  // 120-Second Countdown Timer
  useEffect(() => {
    if (paymentStatus !== 'verifying') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  // Automatic Polling every 4 seconds until complete or timeout
  useEffect(() => {
    if (paymentStatus !== 'verifying' || !queryOrderId || !queryClientTxnId) return;

    const interval = setInterval(() => {
      checkOrderStatus(queryOrderId, queryClientTxnId);
    }, 4000);

    return () => clearInterval(interval);
  }, [paymentStatus, queryOrderId, queryClientTxnId, checkOrderStatus]);

  // Clear Cart & 30-sec Modal timer
  useEffect(() => {
    localStorage.removeItem('cart');
    localStorage.setItem('razorpayorderstatus', paymentStatus);
    setCart([]);

    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 30000);

    return () => clearTimeout(modalTimer);
  }, [setCart, paymentStatus]);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PageHeader
          title="Payment Confirmation"
          subtitle="Complete payment status"
          className="bg-[#4f39bd] text-white rounded-2xl p-8 mb-6 shadow-md"
        />

        <button
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Payment Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                     <span  className="font-medium  "> <CreditCard className="h-5 w-5 text-indigo-600" />
                        <span  className="  font-semibold text-lg "> Payment Summary </span>      
                     </span>
                     <span  className="font-medium gap-1 ">  
                       Status :
                  
                        {paymentStatus !== 'success' ? (

                          <Button
                        
                        className="w-full bg-[#fb8c4d] hover:bg-[#f26e22] text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        size="lg"
                      >
                        Processing 
                        
                      </Button>
                        ) : (

                          <Button
                        
                        className="w-full bg-[#ADFF2F] hover:bg-[#32CD32] text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        size="lg"
                      >
                        Payment Success 
                        
                      </Button>
                        ) }
                     </span>

                   </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    
                   
               </div>
                 
                </div>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Order ID:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100 font-bold">
                      {inOrderId || 'Processing...'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Txn Reference:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">
                      {inClientTxnId || 'Processing...'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Payment Amount:</span>
                    <span className="font-semibold text-indigo-600">
                      ₹{(orderDetails?.amount || amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Created At:</span>
                    <span className="text-sm">{createdAt || 'Pending Verification...'}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">Merchant</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {orderDetails?.merchant_name || "Prime Computer & Network"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">Paid Via</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium uppercase">
                      {orderDetails?.merchant_upi_id || "UPI Mobile"}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Payment</span>
                  <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-indigo-500" /> Fast Delivery</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blue-500" /> 24/7 Support</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Order Status */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-lg border-b pb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  Order Status
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-200 text-sm">
                  <Receipt className="h-5 w-5 flex-shrink-0 text-amber-600" />
                  <p>Order stands submitted once transactions are passed through.</p>
                </div>

                <Button
                  onClick={() => navigate('/dashboard/user/orders')}
                  className="w-full bg-[#4f39bd] hover:bg-[#402da0] text-white font-medium py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  size="lg"
                >
                  <ShoppingBag className="h-4 w-4" />
                  View Orders
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* 30-Second Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Verification</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              We are verifying your transaction with the payment gateway. If your payment was deducted, your order status will automatically update shortly.
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#4f39bd] hover:bg-[#402da0] text-white"
            >
              I Understand
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
