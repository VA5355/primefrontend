import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
/*
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
}*/
// ✅ CORRECT: Indian Rupee Formatter
export function formatCurrency  (amount)   {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export function calculateStock(quantity, sold) {
  return Math.max(0, quantity - sold);
}

export function isInStock(quantity, sold) {
  return calculateStock(quantity, sold) > 0;
}

export function truncateText(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

export function  getEmailImageUrl(isMobile,
  originalUrl  , //: string  | null | undefined,
  width = 300,
  quality = 75
) {                    // : string
  if (!originalUrl) {
    return "";
  }
   let responseUrl  =   isMobile ? originalUrl.replace(
    "/image/upload/",
    `/image/upload/c_limit,w_${width},q_${quality},f_jpg/`
  ) : originalUrl;
  if(isMobile){
     console.log(" responsive url being used from cloudinary "); 
     console.log(" responsive url   "+responseUrl); 

  }
  else {
     console.log(" normal url being used from cloudinary "); 
     console.log("   url   "+responseUrl); 
  }


  return responseUrl
}
