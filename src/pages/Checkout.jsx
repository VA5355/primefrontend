import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard, MapPin, User, Mail, Phone, Home,
  ShoppingCart, ArrowLeft, Shield, Truck, Clock, X, ChevronRight, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';

const UPI_APPS = [
  { id: 'all', name: 'Generic UPI', color: 'bg-indigo-600', badge: 'All Apps' },
  { id: 'gpay', name: 'Google Pay', color: 'bg-blue-600', badge: 'GPay' },
  { id: 'paytm', name: 'Paytm', color: 'bg-sky-500', badge: 'Paytm' },
  { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600', badge: 'PhonePe' },
];

export default function Checkout() {
  const [auth] = useAuth();
  const [cart] = useCart();
  const navigate = useNavigate();

  // Form states
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  // Modal Flow States
  const [gpayamount, setGpayAmount] = useState(0);
  const [isTrialGooglePayOpen, setIsTrialGooglePayOpen] = useState(false);
  const [showDesktopQR, setShowDesktopQR] = useState(false);
  const [selectedApp, setSelectedApp] = useState('all');

  // Timer & UTR Step States
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isMobile, setIsMobile] = useState(false);
  const [showUtrStep, setShowUtrStep] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!cart?.length) {
      navigate('/cart');
      return;
    }
    if (auth?.token) {
      setDeliveryInfo({
        fullName: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || '',
        city: '',
        postalCode: '',
        country: 'India'
      });
    }
  }, [auth?.token, cart?.length, navigate]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (showDesktopQR && !showUtrStep && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !showUtrStep) {
      // Switch automatically to UTR input when timer expires
      setShowUtrStep(true);
    }
    return () => clearInterval(timer);
  }, [showDesktopQR, showUtrStep, timeLeft]);

  const calculateSubtotal = () => cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const calculateShipping = () => (calculateSubtotal() > 100 ? 0 : 10);
  const calculateTax = () => calculateSubtotal() * 0.08;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    return required.every(field => deliveryInfo[field]?.trim()) && deliveryInfo?.country === 'India';
  };

  const handlePlaceOrderClick = () => {
    if (!isFormValid()) {
      toast.error('Please complete all delivery fields and select India as Country.');
      return;
    }
    if (!isPaymentConfirmed) {
      toast.error('Please confirm the payment checkbox.');
      return;
    }
    setGpayAmount(calculateTotal());
    setIsTrialGooglePayOpen(true);
  };

  const handlePayWithUPI = () => {
    setIsTrialGooglePayOpen(false);
    setTimeLeft(300);
    setShowUtrStep(false);
    setShowDesktopQR(true);
  };

  const completeOrderAndRedirect = (utrValue = '') => {
    const orderId = 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const txnParams = new URLSearchParams({
      order_id: orderId,
      amount: gpayamount,
      utr: utrValue,
      status: 'success'
    });
    
    setShowDesktopQR(false);
    navigate(`/customer-onboarding?${txnParams.toString()}`);
  };

  // UPI Link generator
  const merchantUpiId = "primecomputernetwork@upi"; 
  const merchantName = "Prime Computer Network";
  const merchantUpiLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR`;

  return (
    <PageContainer>
      <PageHeader title="Checkout" subtitle="Complete your order" />

      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" /> Delivery Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="fullName" value={deliveryInfo.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" value={deliveryInfo.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" name="phone" value={deliveryInfo.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select name="country" value={deliveryInfo.country} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800">
                    <option value="India">India</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input type="text" name="address" value={deliveryInfo.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" name="city" value={deliveryInfo.city} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input type="text" name="postalCode" value={deliveryInfo.postalCode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" /> Payment Confirmation
              </h2>
              <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaymentConfirmed}
                    disabled={!isFormValid()}
                    onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Confirm UPI & Address Details
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enable QR order generation upon address validation.
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-600" /> Order Summary
              </h2>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(calculateSubtotal())}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{calculateShipping() === 0 ? 'FREE' : formatCurrency(calculateShipping())}</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(calculateTax())}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span><span className="text-indigo-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
              <Button onClick={handlePlaceOrderClick} disabled={!isFormValid() || !isPaymentConfirmed} className="w-full mt-6" size="lg">
                Place Order • {formatCurrency(calculateTotal())}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Initial Portal Modal */}
      {isTrialGooglePayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button onClick={() => setIsTrialGooglePayOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">✕</button>
              <h3 className="text-lg font-semibold">Payment Portal</h3>
              <p className="text-xs text-blue-100">Prime Computer Network</p>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(gpayamount)}</p>
              <button onClick={handlePayWithUPI} className="w-full py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl">
                Pay with Any UPI App →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal Popup (Matching design layout) */}
      <AnimatePresence>
        {showDesktopQR && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-800"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowDesktopQR(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X size={18} />
              </button>

              {!showUtrStep ? (
                /* Step 1: Scan QR Code & App Selector */
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Scan to Pay</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4">Prime Computer Network</p>

                  {/* App Slider / Selector */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto w-full justify-center py-1">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApp(app.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                          selectedApp === app.id 
                            ? `${app.color} text-white shadow-md scale-105` 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {app.badge}
                      </button>
                    ))}
                  </div>

                  {/* QR Box */}
                  <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-4">
                    <QRCodeSVG 
                      value={merchantUpiLink} 
                      size={isMobile ? 180 : 200} 
                      level="H" 
                      includeMargin={true} 
                    />
                  </div>

                  {/* Countdown Bar */}
                  <div className="flex items-center gap-2 text-amber-600 font-mono font-bold bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 px-4 py-2 rounded-full text-xs sm:text-sm mb-3">
                    <Clock size={16} />
                    Expires in {formatTime(timeLeft)}
                  </div>

                  <button
                    onClick={() => setShowUtrStep(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                  >
                    Done scanning? Submit Payment Reference <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                /* Step 2: Input UTR / Txn ID Flow */
                <div className="p-6">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                    <CheckCircle2 size={20} />
                    Confirm Payment Details
                  </div>
                  
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-800 dark:text-white mb-1">
                      Enter 12-Digit UPI Ref / UTR / Txn ID
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Check your GPay, PhonePe, or Paytm debit message/history screen.
                    </p>
                    
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 421019827364"
                      value={utrNumber}
                      className="w-full px-4 py-3 font-mono text-lg tracking-wider border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button 
                      onClick={() => completeOrderAndRedirect(utrNumber)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
                    >
                      Submit Transaction Reference
                    </Button>

                    <button
                      type="button"
                      onClick={() => completeOrderAndRedirect()}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
