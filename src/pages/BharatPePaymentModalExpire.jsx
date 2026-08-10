import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';

export default function BharatPePaymentModal({
  isOpen,
  onClose,
  loading,
  responseState,orderResponseData,
  orderData,
  onOrderExpired
}) {
  const [timeLeft, setTimeLeft] = useState(0);

  const gatewayData = orderData?.data;
  const upiString = gatewayData?.upi_string || '';
  const qrCodeImage = gatewayData?.qr_code || '';
  const amount = gatewayData?.amount || orderData?.bharatPeOrder?.payment?.amount || '0.00';
  const intentLinks = gatewayData?.upi_intent || {};
  const expiresAtStr = gatewayData?.expires_at;

  // Real-time Countdown Timer Hook
  useEffect(() => {
   /* if (!expiresAtStr) return;

    const calculateTimeLeft = () => {
      const diff = Math.floor((new Date(expiresAtStr).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);*/
  }, []);//expiresAtStr

  if (!isOpen) return null;

  const isExpired = false ; // expiresAtStr && timeLeft <= 0;

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
            {/* Amount Banner & Timer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Amount Payable</span>
                <div className="text-2xl font-extrabold text-slate-800">
                  ₹{parseFloat(amount).toFixed(2)}
                </div>
              </div>
                    {/** && !isExpired */}
              {!loading && gatewayData  && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/60 text-amber-700 rounded-full text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                 {/** Expires in {formatSeconds(timeLeft)} */} 
                    Tagged to Recent Cart Order 
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Generating Dynamic BharatPe QR...</p>
              </div>
            ) : isExpired ? (
              /* Expired State Screen */
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">QR Code Expired</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    This BharatPe session has timed out. Please regenerate a new QR code to complete payment.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onOrderExpired();
                    onClose();
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 mx-auto hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Refresh & Re-order
                </button>
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
            ) : gatewayData && (
              /* QR Code & Deep Links Display */
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100">
                    {/* Native Gateway Base64 Image or Dynamic SVG fallback */}
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
                    <a href={intentLinks.phonepe_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-700 text-white font-semibold text-xs">
                      <Smartphone className="w-3.5 h-3.5" /> PhonePe
                    </a>
                  )}
                  {intentLinks.gpay_link && (
                    <a href={intentLinks.gpay_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs">
                      <Smartphone className="w-3.5 h-3.5" /> GPay
                    </a>
                  )}
                  {intentLinks.paytm_link && (
                    <a href={intentLinks.paytm_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-xs">
                      <Smartphone className="w-3.5 h-3.5" /> Paytm
                    </a>
                  )}
                  {intentLinks.bhim_link && (
                    <a href={intentLinks.bhim_link} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-xs">
                      <Smartphone className="w-3.5 h-3.5" /> BHIM
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}