import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  CreditCard, MapPin, User, Mail, Phone, Home,
  ShoppingCart, ArrowLeft, Shield, Truck, Clock, X
} from 'lucide-react';
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import PageContainer from '../components/layout/PageContainer';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';

export default function Checkout() {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Payment & Form states
  const [loading, setLoading] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  // Modal / Payment flow states
  const [gpayamount, setGpayAmount] = useState(0);
  const [isTrialGooglePayOpen, setIsTrialGooglePayOpen] = useState(false);
  const [showDesktopQR, setShowDesktopQR] = useState(false);

  // Timer & Screen states for QR overlay
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isMobile, setIsMobile] = useState(false);

  // Form state default setup
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  // Check screen size
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

  // Handle countdown timer for QR Link expiration
  useEffect(() => {
    let timer;
    if (showDesktopQR && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      toast.error('Payment session expired. Please try again.');
      setShowDesktopQR(false);
    }
    return () => clearInterval(timer);
  }, [showDesktopQR, timeLeft]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 10;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const hasEmptyFields = required.some(field => !deliveryInfo[field]?.trim());
    const isIndia = deliveryInfo?.country === 'India';
    return !hasEmptyFields && isIndia;
  };

  const handlePlaceOrderClick = () => {
    if (!isFormValid()) {
      toast.error('Please complete all delivery fields and ensure India is selected as Country.');
      return;
    }
    if (!isPaymentConfirmed) {
      toast.error('Please confirm the payment checkbox.');
      return;
    }

    const totalToPay = calculateTotal();
    setGpayAmount(totalToPay);
    setIsTrialGooglePayOpen(true);
  };

  const handlePayWithUPI = () => {
    setIsTrialGooglePayOpen(false); // Close initial portal modal
    setTimeLeft(300); // Reset timer to 5 mins
    setShowDesktopQR(true); // Trigger Animated QR Overlay
  };

  const onCloseModal = () => {
    setGpayAmount(0);
    setIsTrialGooglePayOpen(false);
  };

  // UPI Link generation for Prime Computer Network
  const merchantUpiId = "primecomputernetwork@upi"; // Replace with your actual merchant VPA
  const merchantName = "Prime Computer Network";
  const merchantUpiLink = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${gpayamount}&cu=INR`;

  return (
    <PageContainer>
      <PageHeader
        title="Checkout"
        subtitle="Complete your order"
      />

      <button
        onClick={() => navigate('/cart')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Delivery & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={deliveryInfo?.fullName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={deliveryInfo?.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryInfo?.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={deliveryInfo?.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={deliveryInfo?.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={deliveryInfo?.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={deliveryInfo?.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="400001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                Payment Method
              </h2>

              <div className="my-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700">
                <label className={`flex items-start gap-3 cursor-pointer ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isPaymentConfirmed}
                    disabled={!isFormValid()}
                    onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Generate Pay Order QR Code / UPI Confirmation
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {!isFormValid() 
                        ? 'Fill in Street Address, City, Postal Code, Mobile Number, and set Country to India to enable.' 
                        : 'Check this box to confirm order details before proceeding to payment.'}
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    24/7 Support
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-indigo-600" />
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart?.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.price * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculateSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {calculateShipping() === 0 ? 'FREE' : formatCurrency(calculateShipping())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculateTax())}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrderClick}
                disabled={!auth?.token || loading || !cart?.length || !isFormValid() || !isPaymentConfirmed}
                loading={loading}
                className="w-full mt-6"
                size="lg"
              >
                {loading ? 'Processing...' : `Place Order • ${formatCurrency(calculateTotal())}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Portal Initial Modal */}
      {isTrialGooglePayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 p-6 text-white text-center relative">
              <button 
                onClick={onCloseModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
              <div className="w-12 h-12 mx-auto mb-2 bg-white/20 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Payment Portal</h3>
              <p className="text-xs text-blue-100">Prime Computer Network</p>
            </div>

            <div className="p-6 text-center space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                  Payable Amount
                </p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(gpayamount)}
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handlePayWithUPI}
                  className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Pay with Any UPI App →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated QR Code Overlay */}
      <AnimatePresence>
        {showDesktopQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center px-4 py-6 sm:p-8"
          >
            <button 
              onClick={() => setShowDesktopQR(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
            
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Scan to Pay</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Open GPay, PhonePe, or Paytm on your phone</p>

            <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-inner mb-6">
              <div className="w-full flex justify-center">
                <QRCodeSVG 
                  value={merchantUpiLink} 
                  size={isMobile ? 180 : 220} 
                  level="H" 
                  includeMargin={true} 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-600 font-mono font-bold bg-amber-50 px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm">
              <Clock size={16} />
              Link expires in {formatTime(timeLeft)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}