import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  X, 
  Loader2, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function BharatPePaymentModal({
  isOpen,
  onClose,
  loading,
  responseState,
  orderResponseData
}) {
  if (!isOpen) return null;

  // Extract nested gateway payload fields safely
  const gatewayData = orderResponseData?.data ; //orderResponseData?.bharatPeOrderNew?.data;
  const upiString = gatewayData?.upi_string || '';
  const amount = gatewayData?.amount || orderResponseData?.bharatPeOrder?.payment?.amount || '0.00';
  const intentLinks = gatewayData?.upi_intent || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
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
          {/* Header matching screenshot styling */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">Payment Portal</h2>
            <p className="text-xs text-blue-100 font-medium mt-0.5">Prime Computer Network</p>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5">
            {/* Amount Badge */}
            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount Payable</span>
              <div className="text-3xl font-extrabold text-slate-800 mt-1">
                ₹{parseFloat(amount).toFixed(2)}
              </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Generating Dynamic BharatPe QR...</p>
              </div>
            ) : responseState?.type === 'GATEWAY_ERROR' ? (
              /* Gateway Fallback View */
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Order Saved ({responseState.orderId?.slice(0, 8)})
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gateway Delay:</strong> Vyapar Gateway rejected initialization.
                  </span>
                </div>
                {responseState.technicalDetails && (
                  <details className="text-[11px] font-mono bg-amber-100/50 p-2 rounded border border-amber-200/60 mt-2">
                    <summary className="cursor-pointer font-bold">Diagnostics Info</summary>
                    <pre className="mt-1 whitespace-pre-wrap">{responseState.technicalDetails}</pre>
                  </details>
                )}
              </div>
            ) : gatewayData && (
              /* QR Code & Deep Link Buttons View */
              <div className="space-y-5">
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <QRCodeSVG
                      value={upiString}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <QrCode className="w-4 h-4 text-emerald-500" />
                    Scan using any UPI App (BharatPe / GPay / PhonePe)
                  </div>
                </div>

                {/* Mobile Intent Buttons Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {intentLinks.phonepe_link && (
                    <a
                      href={intentLinks.phonepe_link}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs transition"
                    >
                      <Smartphone className="w-4 h-4" /> PhonePe
                    </a>
                  )}
                  {intentLinks.gpay_link && (
                    <a
                      href={intentLinks.gpay_link}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                    >
                      <Smartphone className="w-4 h-4" /> GPay
                    </a>
                  )}
                  {intentLinks.paytm_link && (
                    <a
                      href={intentLinks.paytm_link}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
                    >
                      <Smartphone className="w-4 h-4" /> Paytm
                    </a>
                  )}
                  {intentLinks.bhim_link && (
                    <a
                      href={intentLinks.bhim_link}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition"
                    >
                      <Smartphone className="w-4 h-4" /> BHIM
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