import React, { useEffect, useState, useRef  } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Mail, MapPin, Menu, Navigation, Phone, Server, ShieldCheck, Smartphone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Search,   Clock, TrendingUp, CheckCircle2, AlertCircle  } from 'lucide-react';
import { useSearch } from '../context/search';
import axios from 'axios';
 import CookieButton from './PrimeCookieButton';
 import GradientShadowLine from './GradientShadowLine';
import './PrimeComputerHome.css';

const ADDRESS='Pristine Grandeur, S No. 239, Shop No. 02, Near Meridian Ice-Cream, Opp. Riddhi Siddhi Avenue Gate, Wakad, Pune - 411057';
const MAP_URL='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(ADDRESS);
// AssembleDissemble.gif
// powerpt-slide.gif powerpt-slide-new
const slides=[
  {eyebrow:'ARTISTIC • SOLUTIONS',title:'Gear Up Digitally',description:'State of art designs and faster.',image:'/assets/power-slide-animate.gif',badge:'Design Technology'},
  {eyebrow:'PRIME COMPUTER • TECHNOLOGY SOLUTIONS',title:'Empowering Your Digital World',description:'Technology solutions designed to help businesses work smarter, safer and faster.',image:'/assets/hero-office-1.webp',badge:'Enterprise Technology'},
  {eyebrow:'IT INFRASTRUCTURE',title:'Build a Technology Foundation That Scales',description:'Reliable infrastructure, support and modern computing solutions for growing teams.',image:'/assets/hero-office-2.webp',badge:'Infrastructure'},
  {eyebrow:'BUSINESS COMPUTING',title:'Professional Workstations. Practical Results.',description:'Laptops, desktops, workstations and peripherals selected around the way your team actually works.',image:'/assets/hero-office-3.webp',badge:'Business Computing'},
  {eyebrow:'SECURITY & SUPPORT',title:'Keep Your People Productive',description:'From endpoint protection to troubleshooting and support, keep technology working when the business needs it.',image:'/assets/hero-office-4.webp',badge:'Support & Security'},
  {eyebrow:'PRIME COMPUTER',title:'Technology Solutions With A Local Touch',description:'Personal service from Wakad, Pune with the professionalism expected from a technology partner.',image:'/assets/hero-office-5.webp',badge:'Wakad • Pune'}
];
const links=[{label:'Home',href:'#home'},{label:'About Us',href:'#about'},{label:'Services',href:'#services'},{label:'Contact Us',href:'#contact'}];


 





const values=[
  {Icon:Server,title:'Business IT',text:'Computing, networking & infrastructure', },
  {Icon:ShieldCheck,title:'Security',text:'Practical protection for your business', },
  {Icon:Clock3,title:'Responsive Support',text:'Help when your team needs it', }
];

export default function PrimeComputerHome(){
  const [active,setActive]=useState(0); 
  const [mobile,setMobile]=useState(false); 
  const [paused,setPaused]=useState(false);
  const [isRepeatRender,setRepeatRender]=useState(true);
  const [articleCount,setArticleCount]=useState(0);
    const [keyword, setKeyword] = useState('');
  // const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [primeSelectValues, setPrimeSelectValues] = useSearch();
    const [showToast, setShowToast] = useState(false);
 // const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
 const dummyData = [
    { id: 1, title: 'React Performance Optimization', excerpt: 'Learn how to optimize your React apps using useMemo and useCallback.' },
    { id: 2, title: 'Mastering Framer Motion', excerpt: 'Create stunning animations and layout transitions with ease.' },
    { id: 3, title: 'Tailwind CSS Best Practices', excerpt: 'Keep your utility classes clean, maintainable, and production-ready.' },
  ];
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
    const handleRecentSearch = (search) => {
    setKeyword(search);
    handleSubmit({ preventDefault: () => {} });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    
    try {
      const { data } = await axios.get(`/products/search/${keyword}`);
      setPrimeSelectValues({ ...values, results: data, keyword });

      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [keyword, ...recent.filter(s => s !== keyword)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));

     // onClose();
      navigate('/search');
    } catch (error) {
      console.log(error);
    }
  };

const values=[
  {Icon:Server,title:'Business IT',text:'Computing, networking & infrastructure', valueClicked:handlePrimeValueBusiness},
  {Icon:ShieldCheck,title:'Security',text:'Practical protection for your business', valueClicked:handlePrimeValueSecurity},
  {Icon:Clock3,title:'Responsive Support',text:'Help when your team needs it',valueClicked:handlePrimeValueSupport}
];


  useEffect(()=>{ 
    if(paused||mobile)
      return; 
    const id=setInterval(()=>setActive(v=>(v+1)%slides.length),5500);
      // Load recent searches from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
     return()=>clearInterval(id); 
  },[]); //paused,mobile

  const nav=(e,href)=>{if(href.startsWith('#')){e.preventDefault();setMobile(false);document.querySelector(href)?.scrollIntoView({behavior:'smooth'});}};
  const go=d=>setActive((active+d+slides.length)%slides.length);
  const s=slides[active];








  return <div className="prime-site" id="home">
    <aside className="prime-sidebar">
      {/* <a className="prime-sidebar-logo" href="#home" onClick={e=>nav(e,'#home')}><img src="/assets/prime-logo.png" alt="Prime Computer"/></a>
      <nav className="prime-sidebar-nav">
        <a className="prime-sidebar-link" href="#home" onClick={e=>nav(e,'#home')} title="Home"><span className="prime-sidebar-icon">⌂</span><span className="prime-sidebar-text">Home</span></a>
        <a className="prime-sidebar-link" href="#about" onClick={e=>nav(e,'#about')} title="About Us"><span className="prime-sidebar-icon">A</span><span className="prime-sidebar-text">About</span></a>
        <a className="prime-sidebar-link" href="#contact" onClick={e=>nav(e,'#contact')} title="Contact Us"><span className="prime-sidebar-icon"><Phone size={16}/></span><span className="prime-sidebar-text">Contact</span></a>
      </nav>*/}
    </aside>

    <div className="prime-content-column">
     {/* <header className="prime-header">*/}
       {/*} <Menu /> */}
        {/* <div className="prime-header-building"><img src="/assets/prime-building-small-embossed-bright.webp" alt=""/><div className="prime-header-building-overlay"/></div>
        <div className="prime-header-inner">
          <div className="prime-brand"><img src="/assets/prime-logo.png" alt="Prime Computer" className="prime-brand-logo"/><div><div className="prime-brand-name">PRIME COMPUTER</div><div className="prime-brand-subtitle">TECHNOLOGY SOLUTIONS</div></div></div>
          <button className="prime-mobile-toggle" onClick={()=>setMobile(v=>!v)} aria-label="Toggle navigation">{mobile?<X size={21}/>:<Menu size={21}/>}</button>
          <nav className="prime-main-nav">
            {links.slice(0,3).map((l,i)=><a key={l.label} className={'prime-main-nav-link '+(i===0?'is-active':'')} href={l.href} onClick={e=>nav(e,l.href)}>{l.label}</a>)}
            <a className="prime-contact-cta" href="#contact" onClick={e=>nav(e,'#contact')}>Contact Sales <ArrowRight size={16}/></a>
          </nav>
          <AnimatePresence>{mobile&&<motion.nav className="prime-mobile-menu" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>{links.slice(0,3).map(l=><a key={l.label} href={l.href} onClick={e=>nav(e,l.href)}>{l.label}</a>)}<a className="prime-mobile-menu-cta" href="#contact" onClick={e=>nav(e,'#contact')}>Contact Sales <ArrowRight size={16}/></a></motion.nav>}</AnimatePresence>
        </div>*/}
        {/**/}  
     {/* </header>*/}
      {/*<Menu /> */}
      <main className="prime-main">
        <section className="prime-hero-section" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <div className="prime-hero-card"> 

             <div className="prime-hero-copy gap-1 "><AnimatePresence mode="wait"><motion.div key={s.title} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.45}}>
              {/* <div className="prime-hero-badge">{s.badge}</div>*/}
              
              <div className="prime-hero-eyebrow">{s.eyebrow}</div>
           
            <h1>{s.title}</h1>
            {/*<p>{s.description}</p>*/}
             <GradientShadowLine>
             {s.description}  
            </GradientShadowLine>
           {/*<CookieButton text={s.description}/> */}
               <div className="prime-hero-actions"><a className="prime-primary-button" href="#services" onClick={e=>nav(e,'#services')}>Explore Services <ArrowRight size={17}/></a>
              {/*  <a className="prime-secondary-button" href="#contact" onClick={e=>nav(e,'#contact')}>Talk to Prime</a>*/}
               <a className="prime-chocobar-button" href="#contact" onClick={e=>nav(e,'#contact')}>Talk to Prime</a>
               
               </div></motion.div></AnimatePresence></div>
             {/*}  <div className="prime-hero-image justify-between gap-1 "><AnimatePresence mode="wait"><motion.img key={s.image} src={s.image} alt={s.title} initial={{opacity:0,scale:1.08}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:1.02}} transition={{duration:.75}}/></AnimatePresence>*/}
          <div className="prime-hero-image justify-between gap-1 ">   {/* No working className="prime-hero-image-reveal"  className="prime-hero-image-element"*/} <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={s.image}
                  className="prime-hero-image-reveal"
                  initial={{
                    clipPath: "inset(0 100% 0 0)",
                  }}
                  animate={{
                    clipPath: "inset(0 0% 0 0)",
                  }}
                  exit={{
                    clipPath: "inset(0 0 0 100%)",
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                  className="prime-hero-image-element"
                    draggable="false"
                  />
                </motion.div>
              </AnimatePresence>
         
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 ">
            {/*<div className="prime-hero-image-shade"/>*/}
            </div>
           
            </div>
            <button className="prime-carousel-button prime-carousel-prev" onClick={()=>go(-1)} aria-label="Previous slide"><ChevronLeft size={20}/></button>
            <button className="prime-carousel-button prime-carousel-next" onClick={()=>go(1)} aria-label="Next slide"><ChevronRight size={20}/></button>
            <div className="prime-carousel-counter">0{active+1}<span>/</span>0{slides.length}</div>
            <div className="prime-carousel-dots">{slides.map((x,i)=><button key={x.title} onClick={()=>setActive(i)} aria-label={'Go to slide '+(i+1)} className={'prime-carousel-dot '+(i===active?'is-active':'')}/>)}</div>
          </div>
        </section>

        <section className="prime-value-strip" id="services">{values.map(({Icon,title,text,valueClicked})=><motion.article key={title} whileHover={{y:-3}} className="prime-value-card"><div className="prime-value-icon"><Icon size={19}/></div>
        <div><h3 onClick={(e) => {
              e.stopPropagation(); // Prevents the click from bubbling up to motion.article
              setArticleCount(c => c+1);
                 console.log("h3 called "+articleCount)
                 if(articleCount <5 ){
                  valueClicked();
                 }
            }}   >{title}</h3><p>{text}</p></div>
        
        </motion.article>)}</section>

        <section className="prime-value-select-results">
           {/* on Business IT * will show business products actually LAPTOPs */}
           {/* on Security  * will show secureit products actually Net Protector , Security Cameras  */}
           {/* on Responsive Support * will show secureit Support Team Photos  , Shop memebers  */}
           <motion.div
                       initial={{ opacity: 0, y: -20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       className="  top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50"
                     >
                       <div className="p-4">
                        {/* Recent Searches */}
                                {recentSearches.length > 0 && !keyword && (
                                  <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Recent Searches
                                      </h3>
                                      <button
                                        onClick={clearRecentSearches}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                      >
                                        Clear all
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {recentSearches.map((search, index) => (
                                        <button
                                          key={index}
                                          onClick={() => handleRecentSearch(search)}
                                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                        >
                                          {search}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                  
                                {/* Popular Searches */}
                                {!keyword && (
                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                      <TrendingUp className="h-4 w-4" />
                                      Popular Searches
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((term) => (
                                        <button
                                          key={term}
                                          onClick={() => setKeyword(term)}
                                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-primary dark:text-blue-400 rounded-full text-sm transition-colors"
                                        >
                                          {term}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                  </div>
             </motion.div>                     
        </section>
        <section className="prime-info-section" id="about"><div><div className="prime-section-kicker">ABOUT PRIME COMPUTER</div><h2>Technology should make the business <span>easier, not harder.</span></h2><p>Prime Computer & Network is positioned as a local technology solutions partner for businesses that need dependable computing, infrastructure, support and practical guidance.</p><p>We combine professional service with a local touch, helping customers select, deploy and maintain technology around their actual business requirements.</p><a className="prime-text-link" href="#contact" onClick={e=>nav(e,'#contact')}>Speak with our team <ArrowRight size={16}/></a></div><div className="prime-info-panel"><div className="prime-info-panel-top"><Smartphone size={19}/><span>Technology Solutions</span></div><div className="prime-info-panel-grid"><div><strong>Computing</strong><span>Laptops • desktops • workstations</span></div><div><strong>Infrastructure</strong><span>Networking • storage • deployment</span></div><div><strong>Security</strong><span>Endpoint • backup • hardening</span></div><div><strong>Support</strong><span>Diagnostics • maintenance • assistance</span></div></div></div></section>

        <section className="prime-cta-section"><div><div className="prime-section-kicker">PRIME COMPUTER</div><h2>Let's build your next technology setup.</h2><p>Tell us what you are trying to achieve and we'll help you map the practical technology path.</p></div><a className="prime-primary-button" href="#contact" onClick={e=>nav(e,'#contact')}>Contact Sales <ArrowRight size={17}/></a></section>
              {/* Toast Notification Container */}
          <div className="fixed top-5 right-5 z-50">
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex items-center gap-3 bg-slate-800 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl shadow-lg shadow-black/40 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-medium">Search query initiated!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>                   
      
      </main>

      {/*<footer className="prime-footer" id="contact"><div className="prime-footer-main">
        <div className="prime-footer-brand"><img src="/assets/prime-logo.png" alt="Prime Computer" className="prime-footer-logo"/><div className="prime-footer-brand-copy"><div className="prime-footer-name">PRIME COMPUTER</div><div className="prime-footer-tagline">TECHNOLOGY SOLUTIONS</div></div><p>Technology solutions with a practical, professional and local approach.</p></div>
        <div className="prime-footer-column"><h3>Visit Us</h3><div className="prime-footer-address"><MapPin size={17}/><span>{ADDRESS}</span></div><a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="prime-directions-button"><Navigation size={16}/>Get Directions</a></div>
        <div className="prime-footer-column"><h3>Contact</h3><a href="tel:+919999999999" className="prime-footer-contact"><Phone size={17}/><span>+91 99999 99999</span></a><a href="mailto:info@primecomputer.com" className="prime-footer-contact"><Mail size={17}/><span>info@primecomputer.com</span></a></div>
        <div className="prime-footer-column"><h3>Quick Links</h3>{links.map(l=><a key={l.label} href={l.href} onClick={e=>nav(e,l.href)} className="prime-footer-link">{l.label}</a>)}</div>
        <div className="prime-footer-column"><h3>Customer Service</h3><a href="#contact" onClick={e=>nav(e,'#contact')} className="prime-footer-link">Support Request</a><a href="#contact" onClick={e=>nav(e,'#contact')} className="prime-footer-link">Sales Enquiry</a><a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="prime-footer-link">Find Us on Maps</a></div>
      </div><div className="prime-footer-bottom"><span>© {new Date().getFullYear()} Prime Computer. All Rights Reserved.</span><span>Wakad, Pune • Maharashtra, India</span></div>
      </footer>*/}
    </div>
  </div>;
}
