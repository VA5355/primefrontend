import moment from 'moment';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/cart.js';

export default function ProductCardHorizontal ( { p, remove = true } )
{
  //context
  const [ cart, setCart ] = useCart();
    const [slash , setSlash] = useState('');
  const removeFromCart = async ( productId ) =>
  {
    let myCart = [ ...cart ];
    let index = myCart.findIndex( ( item ) => item.id === productId );
    myCart.splice( index, 1 );
    setCart( myCart );
    localStorage.setItem( 'cart', JSON.stringify( myCart ) );
  };

 const  getProductPath =  (product) => {
      if(product !==undefined && product.photoPath !==undefined && product.photoPath !==null){
         let imgPath = product.photoPath.toString();
         //product.photoPath && isPhotoCloudinary ?  product.photoPath : (product.photoPath ? `${process.env.REACT_APP_API_PHOTOS}${slash}${product.photoPath}` : '/placeholder.png'
        if(imgPath.toLowerCase().startsWith("https://res.cloudinary.com")){
                  //  setPhoto(data.photoPath.toString());
                    console.log('Cloudinary url available ');
              console.log(' Cloudinary url  '+imgPath );   
              
              return imgPath;
                 //   setIsPhotoCloudinary(true)
                    //setIsCreateObject(false)
          }
        else {
            if (imgPath.toLowerCase().startsWith("https://localhost:8000")|| imgPath.toLowerCase().startsWith(process.env.REACT_APP_RAZORORDERANDPAYMENTURL)){
                            console.log('localhost:8000 url available ');
              console.log(' localhost:8000 url  '+imgPath );  
                 return imgPath; 
          }
          else { 
              let photoFirstChar  =  imgPath.slice(0,1);
              let isForwardSlash = photoFirstChar==='/' ? true : false;
              console.log(' photoPath contains forwardslash '+isForwardSlash );
              if(isForwardSlash)
              {
                console.log(' photoPath no forwardslash  required '+isForwardSlash );
                    setSlash('');
                return process.env.REACT_APP_API_PHOTOS+imgPath;
              }else {
                  console.log(' photoPath  forwardslash  required '+(!isForwardSlash) );
                  setSlash('/');
                  return process.env.REACT_APP_API_PHOTOS+'/'+imgPath;
              }
            }
          
        }
      }
       else {
      return '/placeholder.png'
    }
  }
 useEffect(()=>{
      // check the product photoPath begins with / 
      // if not append a /
      let product   =p;
      if (product !== undefined && product.photoPath !==undefined && product.photoPath !==null){
          let imgPath = product.photoPath.toString();
             let photoFirstChar  =  imgPath.slice(0,1);
             let isForwardSlash = photoFirstChar==='/' ? true : false;
          console.log(' photoPath contains forwardslash '+isForwardSlash );
          if(isForwardSlash)
          {
             console.log(' photoPath no forwardslash  required '+isForwardSlash );
                setSlash('');
          }else {
              console.log(' photoPath  forwardslash  required '+(!isForwardSlash) );
              setSlash('/');
          }
        
      }


  },[])
  return (
    <div className='rounded-lg shadow-md mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <div className='flex'>
        <div className='w-1/3 md:w-1/4'>
          {/** p.photoPath ? `${ process.env.REACT_APP_API_PHOTOS }${slash}${ p.photoPath }` : '/placeholder.png'  */}
          <img
            src={getProductPath(p) }
            alt={ p.name }
            className='w-full h-36 object-cover'
          />
        </div>

        <div className='flex-1 p-4'>
          <div className='text-gray-900 dark:text-gray-100'>
            <h5 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
              { p.name } { " " }
              <span className='text-indigo-600 dark:text-indigo-400'>
                { p?.price?.toLocaleString( "en-SG", {
                  style: "currency",
                  currency: "SGD"
                } ) }
              </span>
            </h5>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
              { `${ p.description?.substring( 0, 50 ) }...` }
            </p>

            <div className='flex justify-between items-center'>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Listed { moment( p.createdAt ).fromNow() }
              </p>
              { remove &&
                ( <button 
                    className='text-red-500 dark:text-red-400 text-sm font-medium hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer'
                    onClick={ () => removeFromCart( p.id ) }
                  >
                    Remove
                  </button> )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
