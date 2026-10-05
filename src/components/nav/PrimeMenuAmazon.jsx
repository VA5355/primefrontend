import React, { useState, useEffect } from 'react';
import {Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu as MenuIcon, 
  X, 
  User, 
  ChevronDown,
  Home,
  ShoppingBag,
  Grid3x3,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
//import primecomputerlogo from "@/public/images/prime-computer-gear.png"; 
//import primecomputerlogo from "../../../public/assets/images/prime-computer-gear.png"; 
//import primecomputertext from "../../../public/assets/images/prime-computer-logo-new.png";
//import primecomputertext from "@/public/images/prime-computer-logo-new.png";
import { BiCaretDown } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import { stateProps } from "../../lib/types";
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import { useCartDrawer } from '../../context/cartDrawer';
import useCategory from '../../hooks/useCategory';
import useIsMobile from '../../hooks/useIsMobile';
import { cn } from '../../lib/utils';
import SearchModal from './SearchModal';
//import { PrimeCompWithText } from '../logo/PrimeCompLogoGemini';
// import { PrimeCompWithText } from '../logo/PrimeCompLogoGemini-NoMoble';
 //  import { PrimeCompWithText } from '../logo/PrimeCompLogoGemini-ChatGPT';
import { PrimeCompWithText } from '../logo/PrimeCompLogoGemini-SVG';
import HappyCustomerLogo from "./HappyCustomerLogo";
import ThemeToggle from '../ui/ThemeToggle';

export function checkImageExists(url)  {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export default function Menu() {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [, setCartDrawerOpen] = useCartDrawer();
    const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  const categories = useCategory();
  const navigate = useNavigate();
   const [userValidImg, setUserValidImg] = useState(false);

    // This is problematic as userInfo manot be available 
  const {productData,favoriteData, userInfo} = useSelector(
        (state )=>state.next);

      const dispatch = useDispatch()      
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
    const isNotNullUndefined = (prop) => {
    return prop !== null && prop !== undefined;
  };

  const isMobile = useIsMobile();

  useEffect(() => {

     if ( auth?.token )
    {
       console.log('User is logged in ');
        setDeliveryInfo({
        fullName: auth?.user?.name || '',
        image: auth?.user?.image || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        address: auth?.user?.address || '',
        city: '',
        postalCode: '',
        country: 'India'
      });
      if(auth?.user?.image !==''){
          setUserValidImg(true);
      }
    
    }
      
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    localStorage.removeItem('cart');
    setCart([]);
    navigate("/login");
  };
      const handleNavigation = () => {
    // Perform any custom logic here (e.g., analytics, state updates)
    navigate("/login"); 
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      "flex  gap-3  w-[100%] px-1 py-2 text-sm font-medium transition-colors rounded-md",
      isActive 
        ? "text-primary bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" 
        : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
    );

  return (
    <>
      <div className="w-full h-50 bg-amazon_blue text-lightText sticky top-0 z-50"> 
        <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-2 ">
            {/* href={"/"} logo */}
            <Link to="/" className="px-1 ml-8 pl-12 border border-transparent  bg-white  hover:border-white cursor-pointer duration-300 flex items-center justify-center w-[50%] h-[100%]">
            {/**Image  "w-24  src={primecomputerlogo.src prime-computer-gear.png} */}
            <img className={`${ isMobile ? "w-16" :    "w-24  "} object-cover `} src={` ${isMobile ? '/images/prime-computer-gear-trans-smaller.png' :   "/images/prime-computer-gear-trans-small.png" }` }  width={60}
      height={63} alt="logoImg"/> 
              {/**Image  src={primecomputertext.src} */}
       <img className="w-full px-12   object-cover " src="/images/prime-computer-logo-trans-new.png"  width={480}
      height={203} alt="logoImg"/> 
            </Link>
            {/* delivery */}
            <div className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 items-center justify-center h-[70%] hidden xl:inline-flex gap-1">
          <SlLocationPin />
          <div className="text-xs">
            <p>Deliver to</p>
            <p className="text-white font-bold uppercase">India</p>
          </div>
        </div>
            {/* searchbar */}
            <div className="flex-1 h-10 hidden md:inline-flex items-center justify-between relative ">
                <input className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none
                focus-visible:border-amazon_yellow" type="text" placeholder="Search products"/>
               {/* <span className="w-12 h-full bg-amazon_yellow text-black text-2xl flex
                items-center justify-center absolute right-0 rounded-md rounded-br-md">
                    <HiOutlineSearch/>
                </span>*/}
                 {/* Search Button */}
              {!isMobile && (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
            {/* signin .image */}
            {
                deliveryInfo?<div 
                 className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
                   {userValidImg? <img src={`${ !isNotNullUndefined(deliveryInfo.image ) && deliveryInfo.image !=='' ?  deliveryInfo.image : '/images/user-logged-no-image-smaller.png'}` } alt="userImage"
                    className="w-8 h-8 rounded-full object-cover"/> : <HappyCustomerLogo/>} 
                    {/**<img src={fallbackusergooglesign.src} alt="userImage"
                    className="w-8 h-8 rounded-full object-cover"/> */}
                    <div className="text-xs text-gray-100 flec flex-col
                    justify-between">
                        <p className="text-white font-bold">{deliveryInfo.fullName}</p>
                        <p>{deliveryInfo.email}</p>
                    </div>
                </div>:<div onClick={()=> handleNavigation()} className="text-xs text-gray-100 flex flex-col justify-center px-2 border
            border-transparent hover:border-white cursor-pointer duration-300 h-[70%]">
                <p>Hello, sign in</p>
                <p className="text-white font-bold flex">Account & Lists{" "}<span>
                    <BiCaretDown/></span></p>
            </div>
            }
            {/* favorite */}
            <div className="text-xs text-gray-100 flex flex-col justify-center px-2 border
            border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative">
                <p>Marked</p>
                <p className="=text-white font-bold">& Favorite</p>
                {
                    favoriteData && favoriteData.length > 0 && (
                        <span className="absolute right-2 top-2 w-4 h-4
                        border-[1px] border-gray-400 flex items-center justify-center text-xs
                        text-amazon_yellow">{favoriteData.length}</span>
                    )
                }
                </div>
            {/* cart 
            <Link href={"/cart"} className="flex items-center px-2  border
            border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative">
                <Image className="w-auto object-cover h-8" src={cartIcon} alt="cartImg"/>
                <p className="text-xs text-white font-bold mt-3">Cart</p>
                <span className="absolute text-amazon_yellow text-sm top-2 left-[29px] font-semibold">
                    {productData ? productData.length: 0}
                </span>
            </Link>*/}
               {/* Cart */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 text-green-300 bg-blue-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5 " />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-700 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
               {/* User Menu */}
              {!auth?.user ? (
                <div className="hidden md:flex items-center gap-2">
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-200 hover:text-primary transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-md transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white-900 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {auth?.user.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      userDropdownOpen && "rotate-180"
                    )} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <NavLink
                        to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </NavLink>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}   





        </div>
    </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}