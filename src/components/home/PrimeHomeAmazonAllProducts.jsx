import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, ShoppingCart, Flame } from 'lucide-react';
import { 
  Grid3X3, Tag, Package, ShoppingBag, Sparkles,
  Shirt, Monitor, Home, Heart, Gift, Coffee,
  Book, Gamepad2, Music, Camera
} from 'lucide-react';
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Mail, MapPin, Menu, Navigation, Phone, Server, ShieldCheck, Smartphone, X } from 'lucide-react';
import { useCart } from '../../context/cart';
import useIsMobile from '../../hooks/useIsMobile';
import { formatCurrency, calculateStock, isInStock, truncateText ,getEmailImageUrl} from '../../lib/utils';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import ProductCard from '../cards/ProductCard';
import { SkeletonProductGrid } from '../ui/Skeleton';
 
import { useNavigate } from 'react-router-dom';
 // import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';

export default function PrimeHomeAmazonAllProducts() {
  const [products, setProducts] = useState([]);
   const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const navigate = useNavigate();
    const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [slash , setSlash] = useState('');
  const [isPhotoCloudinary , setIsPhotoCloudinary ] = useState(false);
  //const stock = calculateStock(product.quantity, product.sold);
 // const inStock = isInStock(product.quantity, product.sold);
 // const isPopular = product.sold > 10;
  //const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

// Helper functions for stock and status calculations
  const calculateStock = (quantity, sold) => {
    const qty = quantity !== undefined && quantity !== null ? quantity : 0;
    const sld = sold !== undefined && sold !== null ? sold : 0;
    return Math.max(0, qty - sld);
  };

  const isInStock = (quantity, sold) => {
    return calculateStock(quantity, sold) > 0;
  };

  const isNotNullUndefined = (prop) => {
    return prop !== null && prop !== undefined;
  };


  useEffect(() => {
    loadTrendingProducts();


  }, []);
 
  /*   OLD 
  const loadTrendingProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products/trending?limit=6');
         const  [productsRes ] = await Promise.all([
        axios.get("/products") 
       
      ]);
       //iterate through all products check which had res.cloudinay.com photoPath
      let productsPhotoPathUpdate =    productsRes.data.map(p => { 

        if(p !==undefined && isNotNullUndefined(p.quantity) && isNotNullUndefined(p.sold)  && isNotNullUndefined(p.createdAt) 
              //  && isNotNullUndefined(p.quantity) 
          ) {

          }

          if(p !==undefined && p.photoPath !==undefined && p.photoPath !==null){
         let imgPath = p.photoPath.toString();
         //product.photoPath && isPhotoCloudinary ?  product.photoPath : (product.photoPath ? `${process.env.REACT_APP_API_PHOTOS}${slash}${product.photoPath}` : '/placeholder.png'
        if(imgPath.toLowerCase().startsWith("https://res.cloudinary.com")){
                  //  setPhoto(data.photoPath.toString());
                    console.log('Cloudinary url available ');
              console.log(' Cloudinary url  '+imgPath );   
              p.photoPath = imgPath;
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
                    //  setSlash('');
                // return process.env.REACT_APP_API_PHOTOS+imgPath;
                    p.photoPath = process.env.REACT_APP_API_PHOTOS+imgPath;
                }else {
                    console.log(' photoPath  forwardslash  required '+(!isForwardSlash) );
                //   setSlash('/');
                //   return process.env.REACT_APP_API_PHOTOS+'/'+imgPath;
                    p.photoPath =  process.env.REACT_APP_API_PHOTOS+'/'+imgPath;
                }
            }
          }
      }
       else {
            p.photoPath = 
              '/placeholder.png'
        }
        return p;
      })
      setProducts(productsPhotoPathUpdate);



     // setProducts(data || []);
    } catch (error) {
      console.error('Error loading trending products:', error);
    } finally {
      setLoading(false);
    }
  };
  */
  const loadTrendingProducts = async () => {
    try {
      setLoading(true);
      const [productsRes] = await Promise.all([
        axios.get("/products")
      ]);

      // Map products and attach computed attributes + processed photo path
      let processedProducts = productsRes.data.map(p => {
        if (!p) return p;

        const quantity = isNotNullUndefined(p.quantity) ? p.quantity : 10; // fallback quantity if needed
        const sold = isNotNullUndefined(p.sold) ? p.sold : 0;
        const createdAt = isNotNullUndefined(p.createdAt) ? p.createdAt : new Date();

        // Calculate dynamic properties
        const computedStock = calculateStock(quantity, sold);
        const computedInStock = isInStock(quantity, sold);
        const computedIsPopular = sold > 10;
        const computedIsNew = new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Process image/photoPath logic
        let photoPath = p.photoPath ? p.photoPath.toString() : '';
        let finalPhotoPath = '/placeholder.png';

        if (photoPath) {
          if (photoPath.toLowerCase().startsWith("https://res.cloudinary.com") ||
              photoPath.toLowerCase().startsWith("https://localhost:8000") ||
              (process.env.REACT_APP_RAZORORDERANDPAYMENTURL && photoPath.toLowerCase().startsWith(process.env.REACT_APP_RAZORORDERANDPAYMENTURL))) {
            finalPhotoPath = photoPath;
          } else {
            let isForwardSlash = photoPath.startsWith('/');
            finalPhotoPath = isForwardSlash 
              ? `${process.env.REACT_APP_API_PHOTOS}${photoPath}` 
              : `${process.env.REACT_APP_API_PHOTOS}/${photoPath}`;
          }
        }

        return {
          ...p,
          photoPath: finalPhotoPath,
          stock: computedStock,
          inStock: computedInStock,
          isPopular: computedIsPopular,
          isNew: computedIsNew,
          imageLoading: false,
          imageError: false
        };
      });

      setProducts(processedProducts);
    } catch (error) {
      console.error('Error loading trending products:', error);
    } finally {
      setLoading(false);
    }
  };






  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Trending Now
              </h2>
            </div>
          </div>
          <SkeletonProductGrid count={6} />
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const { 
            id, 
            name, 
            title, 
            price, 
            description, 
            category, 
            photoPath, 
            sold, 
            stock, 
            inStock, 
            isPopular, 
            isNew, 
            slug 
          } = product;

          const displayName = name || title;
          const displayCategory = typeof category === 'object' ? category?.name : category;

          return (
            <motion.div
              key={id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="w-full bg-white dark:bg-gray-900 text-black dark:text-white p-4 border border-gray-300 dark:border-gray-700 rounded-lg group overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
                {isPopular && (
                  <span className="bg-orange-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow flex items-center gap-1 w-max">
                    <TrendingUp className="h-3 w-3" /> {sold} sold
                  </span>
                )}
                {isNew && (
                  <span className="bg-blue-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow w-max">
                    New
                  </span>
                )}
                {!inStock && (
                  <span className="bg-red-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow w-max">
                    Out of Stock
                  </span>
                )}
                {inStock && stock <= 5 && (
                  <span className="bg-amber-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow w-max">
                    Only {stock} left
                  </span>
                )}
              </div>

              {/* Image Container with Hover Quick Actions */}
              <div className="w-full h-[260px] relative overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-md cursor-pointer" onClick={() => slug && navigate(`/product/${slug}`)}>
                {photoPath ? (
                  <img
                    src={photoPath}
                    alt={displayName || "Product Image"}
                    className="w-full h-full object-cover scale-90 group-hover:scale-100 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-300" />
                  </div>
                )}

                {/* Side Action Buttons on Hover */}
                <div className="w-12 h-12 absolute bottom-10 right-0 border-[1px] border-gray-400 bg-white dark:bg-gray-800 rounded-md flex flex-col translate-x-20 group-hover:translate-x-0 transition-transform duration-300 z-20">
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle quick view or cart action here
                    }} 
                    className="w-full h-full border-b-[1px] border-b-gray-400 flex items-center justify-center text-xl bg-transparent hover:bg-orange-200 dark:hover:bg-gray-700 cursor-pointer duration-300"
                    title="Quick View"
                  >
                    <Eye className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add to cart logic here
                    }} 
                    className="w-full h-full flex items-center justify-center text-xl bg-transparent hover:bg-orange-200 dark:hover:bg-gray-700 cursor-pointer duration-300"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                  </span>
                </div>
              </div>

              <hr className="my-3 border-gray-200 dark:border-gray-700" />

              {/* Product Info Section */}
              <div className="px-1 py-1 flex flex-col gap-1">
                {displayCategory && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                    {displayCategory}
                  </p>
                )}
                <p className="text-base font-medium line-clamp-1 text-gray-900 dark:text-gray-100">
                  {displayName}
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    ${price}
                  </span>
                  <span className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 text-justify line-clamp-2">
                  {description ? description.substring(0, 100) : ''}
                </p>

                <button
                  disabled={!inStock}
                  onClick={() => {
                    // Add to cart functionality
                  }}
                  className={`h-10 font-medium rounded-md duration-300 mt-2 flex items-center justify-center gap-2 ${
                    inStock 
                      ? 'bg-blue-600 text-white hover:bg-orange-500 hover:text-black' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );

  /*   OLD 
  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      
       

       
        <div className="w-full px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product , index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              
              <div className="relative group">
                <ProductCard p={product} />

              
                {product.socialProof && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 space-y-1"
                  >
                    {product.socialProof.viewingNow > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Eye className="h-3 w-3 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.viewingNow} people viewing
                        </span>
                      </div>
                    )}
                    {product.socialProof.soldRecently > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.soldRecently} sold in last hour
                        </span>
                      </div>
                    )}
                    {product.socialProof.inCarts > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <ShoppingCart className="h-3 w-3 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.socialProof.inCarts} in carts
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
       
            </motion.div>
          ))}
        </div>

      
    </section>
  );
  */
}