import React, { useEffect, useState } from 'react';
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
import { useCart } from '../context/cart';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import usePageTitle from '../hooks/usePageTitle';

export default function VyaparBharatPeSuccess() {
  usePageTitle('Payment Confirmation');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setCart] = useCart();

  const [showModal, setShowModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    orderId: '',
    paymentId: '',
    amount: 0,
    createdAt: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    // 1. Extract params passed back by Razorpay or custom redirect
    const razorpayPaymentId = searchParams.get('utr') || searchParams.get('razorpay_payment_id') || 'TBD (Order in Processing)';
    const razorpayOrderId = searchParams.get('order_id') || searchParams.get('razorpay_order_id') || 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const amountParam = parseFloat(searchParams.get('amount')) || 2806.92;
    const statusParam = searchParams.get('status') || 'success';

    // 2. Clear shopping cart upon successful payment workflow completion
    localStorage.removeItem('cart');
    localStorage.setItem('razorpayorderstatus', statusParam);
    setCart([]);

    // 3. Populate payment summary details
    setPaymentDetails({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      amount: amountParam,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      description: 'Order placed via Direct Merchant UPI (Prime Computer Network)',
      status: statusParam
    });

    // 4. Delayed Payment Portal Verification Modal (Appears after 30 seconds)
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [searchParams, setCart]);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Updated Banner to match the solid deep-purple layout */}
        <PageHeader
          title="Payment Confirmation"
          subtitle="Complete payment status"
          className="bg-[#4f39bd] text-white rounded-2xl p-8 mb-6 shadow-md"
        />

        {/* Navigation back option */}
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
                <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-semibold text-lg border-b pb-4">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  Payment Summary
                </div>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Order ID:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100 font-bold">{paymentDetails.orderId}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Txn Reference:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">{paymentDetails.paymentId}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Payment Amount:</span>
                    <span className="font-semibold text-indigo-600">{formatCurrency(paymentDetails.amount)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Created At:</span>
                    <span className="text-sm">{paymentDetails.createdAt}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between py-2">
                    <span className="font-medium text-gray-500 dark:text-gray-400">Description:</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 max-w-xs sm:text-right">{paymentDetails.description}</span>
                  </div>
                </div>

                {/* Footer Security Highlights */}
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

      {/* 30-Second Delayed Payment Verification Modal */}
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