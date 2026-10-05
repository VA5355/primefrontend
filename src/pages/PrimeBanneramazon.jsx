import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Mail, MapPin, Menu, Navigation, Phone, Server, ShieldCheck, Smartphone, X } from 'lucide-react';
import { 
  CheckCircle, 
  ShoppingBag, 
  ArrowLeft, 
  
  Truck, 
  Clock, 
  Receipt, 
  CreditCard 
} from 'lucide-react';
const SLIDES = [
    {
    id: 1,
    title: "Up to 60% off",
    desc: "The Premium Edit",
    tag: "Sponsored Discovery",
    gradient: "bg-gradient-to-b from-orange-950/20 to-transparent",  // from-blue-900 via-indigo-950 to-zinc-950
    icon: (
  //   <img alt="op" src="https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/Premium_Edit_BAU_GW._CB783723050_.jpg" height="100%" width="1500px" data-a-hires="https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/Premium_Edit_BAU_GW._CB783723050_.jpg"/> 
     <img alt="op" src="/assets/prime/Store-Address.png" height="100%" width="1500px" data-a-hires="/assets/prime/Store-Address.png"/> 
    )
  },
  /*{
    id: 1,
    title: "Supercharge Your Multi-Cloud Dev",
    desc: "LocalStack & GCP Emulators on ultra-fast NVMe storage.",
    tag: "Sponsored Discovery",
    gradient: "from-blue-900 via-indigo-950 to-zinc-950",
    icon: (
      <svg className="w-24 h-24 text-blue-400 opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },*/
  {
    id: 2,
    title: "Great Indian Festival Starts Early",
    desc: "Up to 40% off on premium developer rigs.",
    tag: "Exclusive Offer",
    gradient: "bg-gradient-to-b from-orange-950/20 to-transparent", // from-orange-950 via-amber-900 to-zinc-950
    icon: (
      <svg className="w-24 h-24 text-amber-400 opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },

 {
    id: 3,
   // title: "Snack Smart with dry fruits ",
    title: "Leverage Device ,Install premium Software licensed",
    desc: "Up to 45% off.",
    tag: "Developer Resource",
    gradient: "bg-gradient-to-b from-orange-950/20 to-transparent",//from-zinc-900 via-zinc-950 to-black
    icon: (
   //  <img alt="MA levis" src="https://images-eu.ssl-images-amazon.com/images/G/31/img24/Fresh/GW/July26/9July/WD/12th_GW_PC1x_Hero_Dry-fruits_2._CB757240985_.jpg" height="100%" width="3000px" data-a-hires="https://images-eu.ssl-images-amazon.com/images/G/31/img24/Fresh/GW/July26/9July/WD/12th_GW_PC1x_Hero_Dry-fruits_2._CB757240985_.jpg"/> 
     <img alt="MA levis" src="/assets/prime/Software.png" height="100%" width="3000px" data-a-hires="/assets/prime/Software.png"/> 
    )
  },
  
 /* {
    id: 3,
    title: "Next.js 14 Production Optimized",
    desc: "Fast rendering with clean Redux Persist integrations.",
    tag: "Developer Resource",
    gradient: "from-zinc-900 via-zinc-950 to-black",
    icon: (
      <svg className="w-24 h-24 text-teal-400 opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },*/
  {
    id: 4,
  //  title: "Signature Flash-Fry Street Food",
    title: "Professional Workstations. Practical Results.",
    desc: "Get fresh torched veggies and paneer delivered in Pune.",
    tag: "Freshly Prepared",
    gradient: "bg-gradient-to-b from-orange-950/20 to-transparent", //from-rose-950 via-red-900 to-zinc-950
    icon: (
      <svg className="w-24 h-24 text-rose-400 opacity-85" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    )
  }
];
const slides=[
 
  {eyebrow:'PRIME COMPUTER • TECHNOLOGY SOLUTIONS',title:'Empowering Your Digital World',description:'Technology solutions designed to help businesses work smarter, safer and faster.',image:'/assets/hero-office-1-new.webp',badge:'Enterprise Technology'},
  {eyebrow:'STORE ADDRESS',title:'Digital Stack of inventories',description:'Prime location spot on , with porter services across hinjewadi, wakad 7 days a week.',image:'/assets/prime/Store-Address.png',badge:'Warhouse Address '},
 
  {eyebrow:'IT INFRASTRUCTURE',title:'Build a Technology Foundation That Scales',description:'Reliable infrastructure, support and modern computing solutions for growing teams.',image:'/assets/hero-office-2.webp',badge:'Infrastructure'},
  {eyebrow:'SOFTWARE SOLUTIONS',title:'Leverage Device ,Install premium Software licensed',description:'Primary to Advanced packages with physical/subscription based.',image:'/assets/prime/Software.png',badge:'Software'},
  {eyebrow:'BUSINESS COMPUTING',title:'Professional Workstations. Practical Results.',description:'Laptops, desktops, workstations and peripherals selected around the way your team actually works.',image:'/assets/hero-office-3.webp',badge:'Business Computing'},
  {eyebrow:'MORDERN TECH',title:'AI Tops/GPU RTX vRAM Rendering devices',description:'AI, AI-Agents all compatible processors/gpus from INEL/AMD/ARM.',image:'/assets/prime/Mordern-tech.png',badge:'Mordern Tech'},
  {eyebrow:'SECURITY & SUPPORT',title:'Keep Your People Productive',description:'From endpoint protection to troubleshooting and support, keep technology working when the business needs it.',image:'/assets/hero-office-4.webp',badge:'Support & Security'},
  {eyebrow:'BUSINESS ESSENTIALS',title:'Professional Elite',description:'On the go , best in class office/industrial/gaming/developer range laptops/mini/workstations.',image:'/assets/prime/Business-laptops.png',badge:'Business Demands'},
  {eyebrow:'PRIME COMPUTER',title:'Technology Solutions With A Local Touch',description:'Personal service from Wakad, Pune with the professionalism expected from a technology partner.',image:'/assets/hero-office-5.webp',badge:'Wakad • Pune'},
  {eyebrow:'ARTIFICIAL INTELLIGENCE',title:'Broadcasting Video Editing Graphics Productive Solutions',description:'AI Boards/Benchmark tutorial communication LARGE SCREEN, YOUTUBERS/CONTENT Creators paradise.',image:'/assets/prime/Artificial-Inteligency.png',badge:'AI Scalers'}
];

/**
 * Custom High-Fidelity Banner Slideshow Component.
 * Engineered to avoid external carousel libraries and relative static image bindings,
 * completely resolving workspace and environment compile failures.
 */
const PrimeBanerAmazon = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
   const [active,setActive]=useState(0); 
    const [mobile,setMobile]=useState(false); 
    const [paused,setPaused]=useState(false);

  const [isRepeatRender,setRepeatRender]=useState(true);
  const [showToast, setShowToast] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
     const [isSearching, setIsSearching] = useState(false);

    const handlePrimeValueBusiness =   () =>  {
    console.log('handlePrimeValueBusiness called ');
    if(!isRepeatRender){
        handleFakeCall();
    }
 }
const handlePrimeValueSecurity =    () =>  {
   console.log('handlePrimeValueSecurity called ');
       if(!isRepeatRender){
         handleFakeCall();
      }
}
const handlePrimeValueSupport =   () =>  {
    console.log('handlePrimeValueSupport called ');
     if(!isRepeatRender){
         handleFakeCall();
      }
} 
const handlePrimeValueQuote =   () =>  {
    console.log('handlePrimeValueQuote called ');

    setQuotationOpen(true)
     if(!isRepeatRender){
         handleFakeCall();
      }
} 


const values=[
  {Icon:Server,title:'Business IT',text:'Computing, networking & infrastructure', valueClicked:handlePrimeValueBusiness},
  {Icon:ShieldCheck,title:'Security',text:'Practical protection for your business', valueClicked:handlePrimeValueSecurity},
  {Icon:Clock3,title:'Responsive Support',text:'Help when your team needs it',valueClicked:handlePrimeValueSupport},
    {Icon:Receipt ,title:'Quotation',text:'Send us your Requirement', valueClicked:handlePrimeValueQuote}
];
  const dummyData = [
    { id: 1, title: 'React Performance Optimization', excerpt: 'Learn how to optimize your React apps using useMemo and useCallback.' },
    { id: 2, title: 'Mastering Framer Motion', excerpt: 'Create stunning animations and layout transitions with ease.' },
    { id: 3, title: 'Tailwind CSS Best Practices', excerpt: 'Keep your utility classes clean, maintainable, and production-ready.' },
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handleFakeCall = () => {
    // Trigger Toast
    setShowToast(true);
    setIsSearching(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // Simulate API delay for search results
    setTimeout(() => {
      setRecentSearches(dummyData);
      setRepeatRender(true);
      setIsSearching(false);
    }, 800);
  };

  const nav=(e,href)=>{if(href.startsWith('#')){e.preventDefault();setMobile(false);document.querySelector(href)?.scrollIntoView({behavior:'smooth'});}};
  const go=d=>setActive((active+d+slides.length)%slides.length);
  const s=slides[active];
  const [quotationOpen, setQuotationOpen] = useState(false);







  return (
    <div className="relative h-[240px] md:h-[400px] w-full overflow-hidden bg-zinc-950">
      {/* Slides Viewport */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      > {/** bg-gradient-to-r */}
        {SLIDES.map((slide) => (
          <div 
            key={slide.id} 
            className={`w-full h-full flex-shrink-0  ${slide.gradient} flex items-center justify-between px-8 md:px-24 text-white relative`}
          >
            {/* Left Content Area */}
            <div className="flex flex-col justify-center max-w-xl z-10">
              <span className="text-amber-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mb-1">
                {slide.tag}
              </span>
              <h1 className="text-xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {slide.title}
              </h1>
              <p className="text-xs md:text-lg text-zinc-300 mt-2 max-w-md">
                {slide.desc}
              </p>
              <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-black text-[10px] md:text-sm font-bold py-2 px-5 md:px-6 rounded-lg w-fit transition-all shadow-lg shadow-amber-500/10 active:scale-95">
                Explore Now
              </button>
            </div>

            {/* Right Graphic Area */}
            <div className="hidden sm:flex items-center justify-center p-4 z-10">
              {slide.icon}
            </div>

            {/* Ambient Background Watermark */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white backdrop-blur-sm transition-all z-30"
        aria-label="Previous Slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white backdrop-blur-sm transition-all z-30"
        aria-label="Next Slide"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Decorative Bottom Fade Effect bg-gradient-to-t from-gray-300 to-transparent*/}
      <div className="absolute bottom-0 left-0 right-0 h-20  pointer-events-none z-20" />
    </div>
  );
};

export default PrimeBanerAmazon;