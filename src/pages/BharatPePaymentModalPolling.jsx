import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Loader2, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  RotateCcw,
  RefreshCw,
  ShieldCheck,
  Search
} from 'lucide-react';
import { REACT_APP_BHARATPEORDERANDPAYMENTURL } from '../libs/client';
import { REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL } from '../libs/client';
import { REACT_APP_NGROKLOCALHOST } from '../libs/client';

export default function BharatPePaymentModal({
  isOpen,
  onClose,
  loading,
  responseState,
  orderResponseData,
  orderData,
  onOrderExpired
}) {
  const gatewayData = orderData?.data;
  const orderId = gatewayData?.order_id || responseState?.orderId;
  const clientTxnId = gatewayData?.client_txn_id;
  const upiString = gatewayData?.upi_string || '';
  const qrCodeImage = gatewayData?.qr_code || '';
  const amount = gatewayData?.amount || orderData?.bharatPeOrder?.payment?.amount || '0.00';
  const intentLinks = gatewayData?.upi_intent || {};

  // State Management
  const [timeLeft, setTimeLeft] = useState(120); // 120-second active window
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending' | 'success' | 'failed'

  // -------------------------------------------------------------
  // 1. Polling Function: Fetch Status from Node.js Backend
  // -------------------------------------------------------------
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId && !clientTxnId) return;

    try {
      const targetId = orderId || clientTxnId;
       const baseUrl =
             ( window.location.hostname === `${REACT_APP_NGROKLOCALHOST}` ||   window.location.hostname === 'localhost')
            //  window.location.hostname === `${REACT_APP_NGROKLOCALHOST}`
                 ?  `${ REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL}`
                      : `${ REACT_APP_BHARATPEORDERANDPAYMENTURL}`;


      const res = await fetch(`${baseUrl}/api/bharatpeorder/status/${targetId}`);
      const data = await res.json();

      // Check if success from Backend DB or forwarded Vyapar response
      if (data?.status === true && (data?.data?.status === 'success' || data?.orderStatus === 'success')) {
        setPaymentStatus('success');
        // Redirect automatically to the success page
        window.location.href = `/vyaparbharatpesuccess?order_id=${orderId}&clientTxnId=${ clientTxnId}`;
      } else if (data?.data?.status === 'failed') {
        setPaymentStatus('failed');
      }
    } catch (err) {
      console.error('Polling error checking order status:', err);
    }
  }, [orderId, clientTxnId]);

  // -------------------------------------------------------------
  // 2. Real-Time 120-Second Countdown Timer Hook
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || paymentStatus === 'success') return;

    setTimeLeft(120);
    setIsTimedOut(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentStatus]);

  // -------------------------------------------------------------
  // 3. Polling Interval Hook (Runs every 3 seconds while open)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || paymentStatus === 'success') return;

    // Initial check
    checkPaymentStatus();

    const pollingInterval = setInterval(() => {
      checkPaymentStatus();
    }, 3000);

    return () => clearInterval(pollingInterval);
  }, [isOpen, paymentStatus, checkPaymentStatus]);

  // Manual Trigger for status re-check
  const handleManualRecheck = async () => {
    setIsManualChecking(true);
    await checkPaymentStatus();
    setTimeout(() => setIsManualChecking(false), 800);
  };

  if (!isOpen) return null;

  const formatSeconds = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">Payment Portal</h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">Prime Computer Network</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Amount Banner & Active Timer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Amount Payable</span>
                <div className="text-2xl font-extrabold text-slate-800">
                  ₹{parseFloat(amount).toFixed(2)}
                </div>
              </div>
              
              {!loading && gatewayData && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-colors ${
                  isTimedOut 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-amber-50 border-amber-200/60 text-amber-700'
                }`}>
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  {isTimedOut ? 'Auto-Sync Active' : `Expires in ${formatSeconds(timeLeft)}`}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Generating Dynamic BharatPe QR...</p>
              </div>
            ) : responseState?.type === 'GATEWAY_ERROR' ? (
              /* Gateway Error View */
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Order Saved ({responseState.orderId?.slice(0, 8)})
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Vyapar Gateway rejected initialization.</span>
                </div>
              </div>
            ) : isTimedOut ? (
              /* ------------------------------------------------------------------- */
              /* ENGAGEMENT MODE: AFTER 120 SECONDS PASSES WITHOUT AUTOMATIC CONFIRM */
              /* ------------------------------------------------------------------- */
              <div className="py-6 px-2 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <Search className="w-6 h-6 text-blue-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Fetching Payment Status</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    We are verifying your transaction with Vyapar Gateway & BharatPe. If you completed payment, please remain on this screen.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleManualRecheck}
                    disabled={isManualChecking}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isManualChecking ? 'animate-spin' : ''}`} />
                    {isManualChecking ? 'Checking with Bank...' : 'I Have Paid — Check Now'}
                  </button>

                  <button
                    onClick={() => {
                      if (onOrderExpired) onOrderExpired();
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Cancel or Try Again
                  </button>
                </div>
              </div>
            ) : gatewayData && (
              /* Standard Active QR Code & Deep Links View */
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100 relative">
                  <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {qrCodeImage ? (
                      <img src={qrCodeImage} alt="BharatPe QR Code" className="w-44 h-44 object-contain" />
                    ) : (
                      <QRCodeSVG value={upiString} size={175} level="H" includeMargin={true} />
                    )}
                  </div>
                  
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                    Scan using any UPI App (GPay / PhonePe / Paytm)
                  </div>
                </div>

                {/* Intent Links */}
                <div className="grid grid-cols-2 gap-2">
                  {intentLinks.phonepe_link && (
                    <a href={intentLinks.phonepe_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-xs hover:bg-purple-800 transition">
                      <Smartphone className="w-3.5 h-3.5" /> PhonePe
                    </a>
                  )}
                  {intentLinks.gpay_link && (
                    <a href={intentLinks.gpay_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition">
                      <Smartphone className="w-3.5 h-3.5" /> GPay
                    </a>
                  )}
                  {intentLinks.paytm_link && (
                    <a href={intentLinks.paytm_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs hover:bg-sky-700 transition">
                      <Smartphone className="w-3.5 h-3.5" /> Paytm
                    </a>
                  )}
                  {intentLinks.bhim_link && (
                    <a href={intentLinks.bhim_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition">
                      <Smartphone className="w-3.5 h-3.5" /> BHIM
                    </a>
                  )}
                </div>

                {/* Footer Security Badge */}
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Safe & Secured by Vyapar Gateway
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
