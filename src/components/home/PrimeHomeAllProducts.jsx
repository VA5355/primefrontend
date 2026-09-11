import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, ShoppingCart, Flame } from 'lucide-react';
import ProductCard from '../cards/ProductCard';
import { SkeletonProductGrid } from '../ui/Skeleton';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function PrimeHomeAllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingProducts();
  }, []);

  const loadTrendingProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/products/trending?limit=6');
         const  [productsRes ] = await Promise.all([
        axios.get("/products") 
       
      ]);
       //iterate through all products check which had res.cloudinay.com photoPath
      let productsPhotoPathUpdate =    productsRes.data.map(p => { 
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
       

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Trending Badge
              {index < 3 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    #{index + 1} Trending
                  </div>
                </div>
              )} */}

              <div className="relative group">
                <ProductCard p={product} />

                {/* Social Proof Indicators */}
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
                   {/* Products Grid/List */}
               {/*

                
       
          {loading ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "grid gap-6",
                  viewMode === 'grid' 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts?.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard p={p} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}


                */}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}