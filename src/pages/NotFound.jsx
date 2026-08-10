import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  ArrowLeft, 
  Home, 
  Search, 
  Truck, 
  PhoneCall, 
  RotateCcw, 
  LifeBuoy, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';

// Route metadata map for personalized messaging
const PENDING_ROUTES = {
  '/shipping': {
    title: 'Shipping & Delivery Hub',
    description: 'We are integrating real-time logistics tracking and store pickup scheduling for offline customers.',
    icon: Truck,
    badge: 'Logistics Portal'
  },
  '/contact': {
    title: 'Contact & Store Locator',
    description: 'Direct WhatsApp integration and store location map features are currently being provisioned.',
    icon: PhoneCall,
    badge: 'Connect Portal'
  },
  '/returns': {
    title: 'Returns & Warranty Desk',
    description: 'Automated instant refund workflows and digital warranty verification are under development.',
    icon: RotateCcw,
    badge: 'Service Portal'
  },
  '/support': {
    title: 'Customer Support Desk',
    description: '24/7 AI-assisted troubleshooting and ticket management systems are coming online very soon.',
    icon: LifeBuoy,
    badge: 'Help Desk'
  }
};

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve route metadata or fallback to general 404/Construction state
  const currentPath = location.pathname.toLowerCase();
  const routeMeta = PENDING_ROUTES[currentPath] || {
    title: 'Page Under Construction',
    description: 'This section of PrimeComputerNetwork is being calibrated for an upgraded store experience.',
    icon: Wrench,
    badge: 'System Update'
  };

  const PageIcon = routeMeta.icon;

  return (
    <PageContainer>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full text-center">
          
          {/* Animated Graphic Badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative inline-block mb-8"
          >
            {/* Glowing Backdrop Circle */}
            <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-2xl transform scale-150" />
            
            <div className="relative bg-white dark:bg-gray-900 border-2 border-indigo-100 dark:border-indigo-950 p-6 rounded-3xl shadow-xl flex items-center justify-center">
              <PageIcon className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              
              {/* Floating Construction Indicator */}
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg"
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>

          {/* Dynamic Content Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Clock className="h-3.5 w-3.5" />
              {routeMeta.badge} • Coming Soon
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {routeMeta.title}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
              {routeMeta.description}
            </p>
          </motion.div>

          {/* Quick Route Preview Switcher */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Under Construction Modules
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { path: '/shipping', label: 'Shipping', icon: Truck },
                { path: '/contact', label: 'Contact', icon: PhoneCall },
                { path: '/returns', label: 'Returns', icon: RotateCcw },
                { path: '/support', label: 'Support', icon: LifeBuoy },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ItemIcon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Home className="h-4 w-4" />
              Back to Store Home
            </Button>

            <Button
              onClick={() => navigate('/shop')}
              variant="secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Browse Products
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Footer note for client store */}
          <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
            PrimeComputerNetwork Digital Systems • Store Offline Services Available
          </p>

        </div>
      </div>
    </PageContainer>
  );
}