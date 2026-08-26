import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  AlertOctagon, 
  RotateCcw, 
  ShoppingBag, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function QrCodeExpiredModal({ 
  isOpen, 
  onClose, 
  orderId, 
  amount,
  onRetry 
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Handles navigation back to cart route
  const handleReturnToCart = () => {
    if (onClose) onClose();
    navigate('/cart');
  };

  const handleRetryPayment = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleReturnToCart();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleReturnToCart}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-5 text-white text-center relative">
            <button
              onClick={handleReturnToCart}
              className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold tracking-tight">QR Code Expired</h2>
            <p className="text-xs text-rose-100 font-medium mt-0.5">Prime Computer Network</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Expiry Alert Body */}
            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
                <AlertOctagon className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Transaction Window Elapsed
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  The payment session for this order has timed out to prevent double-charging. Please initiate a new transaction.
                </p>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              {amount && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Attempted Amount:</span>
                  <span className="text-slate-800 font-bold text-sm">
                    ₹{parseFloat(amount).toFixed(2)}
                  </span>
                </div>
              )}
              {orderId && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Order Reference:</span>
                  <span className="font-mono text-slate-600 font-semibold">{orderId}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleRetryPayment}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 transition active:scale-[0.98]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate Payment QR
              </button>

              <button
                onClick={handleReturnToCart}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Back to Cart
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Footer Note */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              If funds were deducted, they will automatically refund within 24–48 hours.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}