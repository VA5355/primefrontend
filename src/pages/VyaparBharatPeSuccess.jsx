import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  ArrowRight, 
  Receipt, 
  Download, 
  ShieldCheck, 
  Building2, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useParams } from 'react-router-dom';

// Demo Initial Data structure - Replace or pass via props/route state
const VyaparBharatPeSuccess = ({ 
  orderId = "5fe8a3c47b1c4d6f9e0d8a2b1c3d4e5f", 
  clientTxnId = "TXN123456",
  amount = 150.50,
  apiKey =  process.env.REACT_APP_VYAPAR_PROD_KEY// Always keep sensitive keys in Backend API routes"vg_live_YOUR_KEY"
}) => {
  const [paymentStatus, setPaymentStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed' | 'timeout'
  const [orderDetails, setOrderDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds fallback timer
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [inOrderId, setInOrderId] = useState(false);
  const [inClientTxnId, setInClientTxnId] = useState(false);
    const params = useParams();

  // Function to call Check Order Status API
  const checkOrderStatus = useCallback(async ( inId ,inClientTxnId) => {
    setIsChecking(true);
    try {
      // In production, route this call through your Node.js backend:
      // const res = await fetch('/api/vyapar/check-status', { method: 'POST', body: JSON.stringify({ order_id: orderId, client_txn_id: clientTxnId }) });
      
      const response = await fetch('https://vyapargateway.com/api/v1/check_order_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: apiKey,
          order_id: orderId || inId ,
          client_txn_id: inClientTxnId
        })
      });

      const result = await response.json();

      if (result.status && result.data?.status === 'success') {
        setOrderDetails(result.data);
        setPaymentStatus('success');
      } else if (result.data?.status === 'failed') {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
    } finally {
      setIsChecking(false);
    }
  }, [  apiKey]);//orderId,

   useEffect(() => {
    if (params?.order_id && params?.clientTxnId) 
    { let orid = params?.order_id;
      console.log('Vyapar Bharat Pe Success  order_id '+orid);
      setInOrderId( orid);
      let txnId = params?.clientTxnId;
      console.log('Vyapar Bharat Pe Success  clientTxnId '+txnId);
      setInClientTxnId( txnId);


      checkOrderStatus(orid, txnId);
    }

      //loadProduct();
  }, [params?.order_id]);
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
    if (paymentStatus !== 'verifying') return;

    // Initial check
    checkOrderStatus();

    const interval = setInterval(() => {
      checkOrderStatus();
    }, 4000);

    return () => clearInterval(interval);
  }, [paymentStatus, checkOrderStatus]);

  const copyTxnId = () => {
    navigator.clipboard.writeText(clientTxnId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-400 mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Prime Computer & Network</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Payment Portal Verification</h1>
        </div>

        {/* Main Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${
            paymentStatus === 'success' ? 'bg-emerald-500' :
            paymentStatus === 'failed' ? 'bg-rose-500' :
            paymentStatus === 'timeout' ? 'bg-amber-500' : 'bg-blue-500'
          }`} />

          <AnimatePresence mode="wait">
            
            {/* STATE 1: VERIFYING / WAITING */}
            {paymentStatus === 'verifying' && (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500"
                  />
                  <Clock className="w-10 h-10 text-blue-400 animate-pulse" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Awaiting Payment Confirmation</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Please complete the payment on your mobile UPI app (GPay, PhonePe, Paytm, or BHIM).
                </p>

                {/* Amount Display */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 mb-6 inline-block min-w-[200px]">
                  <span className="text-xs uppercase text-slate-400 tracking-wider block font-semibold mb-1">Amount Payable</span>
                  <span className="text-3xl font-extrabold text-white">₹{amount.toFixed(2)}</span>
                </div>

                {/* Timer Box */}
                <div className="flex items-center justify-center gap-2 text-slate-300 text-sm bg-slate-800 py-2.5 px-4 rounded-lg border border-slate-700/80 max-w-xs mx-auto">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Auto-checking status...</span>
                  <span className="font-mono font-bold text-amber-400 ml-auto">{formatTime(timeLeft)}</span>
                </div>
              </motion.div>
            )}

            {/* STATE 2: SUCCESS */}
            {paymentStatus === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-2"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-1">Payment Successful!</h2>
                <p className="text-emerald-400 font-medium text-sm mb-6 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Verified by Vyapar Gateway / BharatPe
                </p>

                {/* Receipt Card */}
                <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-700 text-left space-y-3 mb-6 shadow-inner">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="text-slate-400 text-sm">Amount Paid</span>
                    <span className="text-xl font-extrabold text-white">₹{(orderDetails?.amount || amount).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Transaction ID</span>
                    <div className="flex items-center gap-1.5 font-mono text-slate-200">
                      <span>{clientTxnId}</span>
                      <button onClick={copyTxnId} className="hover:text-blue-400 transition-colors">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Order ID</span>
                    <span className="font-mono text-slate-200 text-xs truncate max-w-[180px]">{orderId}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Merchant</span>
                    <span className="text-slate-200 font-medium">{orderDetails?.merchant_name || "Acme Store"}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Paid Via</span>
                    <span className="text-slate-200 font-medium uppercase">{orderDetails?.merchant_upi_id || "UPI Mobile"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Receipt
                  </button>
                  <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE 3: TIMEOUT (User took longer than 120s or state unknown) */}
            {paymentStatus === 'timeout' && (
              <motion.div 
                key="timeout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Still Waiting for Confirmation?</h2>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                  If you have already paid using GPay/PhonePe/Paytm, please click the re-check button below. Webhook sync may take a few extra moments.
                </p>

                <div className="space-y-3">
                  <button 
                    onClick={checkOrderStatus}
                    disabled={isChecking}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    {isChecking ? 'Verifying with BharatPe...' : 'Check Payment Status Now'}
                  </button>

                  <button 
                    onClick={() => setPaymentStatus('verifying')}
                    className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-all"
                  >
                    Wait 2 More Minutes
                  </button>
                </div>
              </motion.div>
            )}

            {/* STATE 4: FAILED */}
            {paymentStatus === 'failed' && (
              <motion.div 
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-rose-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Payment Declined or Cancelled</h2>
                <p className="text-slate-400 text-sm mb-6">
                  We could not verify payment for Order <span className="font-mono text-slate-200">{clientTxnId}</span>.
                </p>

                <button 
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all"
                >
                  Return to Checkout & Retry
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Card Footer Help Section */}
          <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Encrypted Gateway
            </span>
            <a href="mailto:support@primecomputernetwork.com" className="hover:text-slate-200 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Support
            </a>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default VyaparBharatPeSuccess;
