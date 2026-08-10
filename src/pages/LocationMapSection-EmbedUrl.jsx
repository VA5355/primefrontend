import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';

// Default fallback URL if none is passed via props
const DEFAULT_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.25056743818!2d73.85674370000001!3d18.5175904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fb76926cf%3A0xbcf04fb1758c06e1!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin";

export default function LocationMapSectionEmbedUrl({ 
  mapEmbedUrl = DEFAULT_MAP_URL, 
  address = "Prime Computer Network, Pune, Maharashtra, India",
  phone = "+91 (020) 2400-0000",
  email = "support@primecomputernetwork.com"
}) {
  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4" /> Official Location
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            Visit Prime Computer Network
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Find us effortlessly or get in touch with our team for IT services and hardware solutions.
          </p>
        </motion.div>

        {/* Content Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-100 border-b border-slate-700/60 pb-3">
                Contact & Office Details
              </h3>

              <ul className="space-y-5">
                <li className="flex items-start gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Address</span>
                    <span className="text-sm font-medium">{address}</span>
                  </div>
                </li>

                <li className="flex items-start gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Email Us</span>
                    <a href={`mailto:${email}`} className="text-sm font-medium hover:text-blue-400 transition-colors">
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Phone</span>
                    <span className="text-sm font-medium">{phone}</span>
                  </div>
                </li>

                <li className="flex items-start gap-4 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-semibold">Business Hours</span>
                    <span className="text-sm font-medium">Mon - Sat: 9:30 AM – 7:00 PM (IST)</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
              <a
                href="https://primecomputernetwork.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-600/50 transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Website
              </a>
            </div>
          </motion.div>

          {/* Safe Map Frame */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 relative min-h-[380px] lg:min-h-full rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl group"
          >
            {mapEmbedUrl ? (
              <iframe
                title="Prime Computer Network Map Location"
                src={mapEmbedUrl}
                className="w-full h-full min-h-[400px] border-0 grayscale transition-all duration-500 group-hover:grayscale-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-800 text-slate-400">
                Map configuration pending...
              </div>
            )}

            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Map
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}