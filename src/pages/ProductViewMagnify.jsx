import { useState, useEffect } from 'react';

// 1. IMPORT PRODUCT SCHEMA & SEO HEAD
import { ProductJsonLd } from '../components/ProductJsonLd.jsx';


import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import {
  ShoppingCart, Share2, Shield, Truck, Package,
  ChevronRight, Minus, Plus, Clock,
  ArrowLeft, ZoomIn, Tag, Info
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import ProductCard from '../components/cards/ProductCard.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
// import { Card, CardContent } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useCart } from '../context/cart.js';
import { formatCurrency, calculateStock, isInStock } from '../lib/utils.js';
import { cn } from '../lib/utils.js';
import usePageTitle from '../hooks/usePageTitle.js';

export default function ProductView() {
   const [product, setProduct] = useState({});
  // const [photos, setPhotos] = useState([]);
  // const [productPic , setProductPic]= useState('');
  //  const [isPhotoCloudinary , setIsPhotoCloudinary ] = useState(false);
  //  const [slash , setSlash] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });

  usePageTitle(product.name || 'Product');
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  //const [isZoomed, setIsZoomed] = useState(false);
  
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();


/*  useEffect(()=>{
      // check the product photoPath begins with / 
      // if not append a /
      if (product !== undefined && product.photoPath !==undefined && product.photoPath !==null){
          let imgPath = product.photoPath.toString();
             let photoFirstChar  =  imgPath.slice(0,1);
             let isForwardSlash = photoFirstChar==='/' ? true : false;
          console.log(' photoPath contains forwardslash '+isForwardSlash );
          if(isForwardSlash)
          {       // check if photos array is filled 
                if(product.photos != null && Array.isArray(product.photos) && product.photos.length > 0 ){   
                     imgPath =  product.photos[0];
                   setPhotos(product.photos);
                    setIsPhotoCloudinary(true);
                    console.log(' photos  array contains first image '+ imgPath );
                    setProductPic(imgPath);
                }
                else { 
                  console.log(' photoPath no forwardslash  required '+isForwardSlash );
                    setSlash('');
                }
          }else {
              console.log(' photoPath  forwardslash  required '+(!isForwardSlash) );
              setSlash('/');
          }
        
      }


  },[]) */



  useEffect(() => {
    if (params?.slug) loadProductNew();
  }, [params?.slug]);
  const loadProductNew = async () => {
  setLoading(true);

  try {
    const { data } = await axios.get(`/product/${params.slug}`);

    setProduct(data);
    setSelectedImage(0);
    setIsZoomed(false);

    loadRelated(data.id, data.category.id);

  } catch (error) {
    console.error(error);
    toast.error("Failed to load product");

  } finally {
    setLoading(false);
  }
};
/*
  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/product/${params.slug}`);
      setProduct(data);
        if (data !== undefined && data.photoPath !==undefined){
          let imgPath = data.photoPath.toString();
         if(imgPath.toLowerCase().startsWith("https://res.cloudinary.com")){
            //setPhoto(data.photoPath.toString());
            setIsPhotoCloudinary(true)
            if(data.photos != null && Array.isArray(data.photos) && data.photos.length > 0 ){   
              setPhotos(data.photos);
            }
            console.log('Cloudinary url available ')
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
              // check if photos array is filled 
                if(data.photos != null && Array.isArray(data.photos) && data.photos.length > 0 ){   
                     imgPath =  data.photos[0];
                   setPhotos(data.photos);
                    setIsPhotoCloudinary(true)
                    console.log(' photos  array contains first image '+ imgPath );
                       setProductPic(imgPath);
                       return imgPath; 
                }
                else { 
                   console.log(' photoPath no forwardslash  required '+isForwardSlash );
                  setSlash('');
                }
                
            }else {
                console.log(' photoPath  forwardslash  required '+(!isForwardSlash) );
                setSlash('/');
            }
         }
        }
       } 



      loadRelated(data.id, data.category.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };
  */
  const loadRelated = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/products/related/${productId}/${categoryId}`
      );
      setRelated(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const stock = calculateStock(product.quantity, product.sold);
    
    if (currentQuantityInCart + quantity > stock) {
      toast.error(`Only ${stock - currentQuantityInCart} items available`);
      return;
    }

    let updatedCart = [...cart];
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart.push({ ...product, quantity });
    }
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  const handleQuantityChange = (action) => {
    const stock = calculateStock(product.quantity, product.sold);
    if (action === 'increase' && quantity < stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Resolve Cloudinary and locally hosted product image URLs.
  const getProductImageUrl = (image) => {
    if (!image) return '/placeholder.png';

    // Support either string URLs or image objects.
    const imagePath =
      typeof image === 'string'
        ? image
        : image.secure_url || image.url || image.path;

    if (!imagePath) return '/placeholder.png';

    if (
      imagePath.startsWith('https://') ||
      imagePath.startsWith('http://')
    ) {
      return imagePath;
    }

    const baseUrl = (
      process.env.REACT_APP_API_PHOTOS || ''
    ).replace(/\/$/, '');

    return `${baseUrl}/${imagePath.replace(/^\/+/, '')}`;
  };

  // Derive the gallery from the loaded product object.
  const galleryImages = (() => {
    const productPhotos = Array.isArray(product.photos)
      ? product.photos
      : [];

    const validPhotos = productPhotos.filter(Boolean);

    // Prefer the multiple-photo array.
    if (validPhotos.length > 0) {
      return validPhotos.map(getProductImageUrl);
    }

    // Fall back to the primary product image.
    return product.photoPath
      ? [getProductImageUrl(product.photoPath)]
      : ['/placeholder.png'];
  })();

  const activeImage =
    galleryImages[selectedImage] || galleryImages[0];

  // Amazon-style magnifier settings.
  const zoomLevel = 2.5;
  const lensSize = 220;
  const leftOffset = 240;

  const handleImageMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    let x =
      event.clientX - rect.left - lensSize / 2 ; 

    let y =
      event.clientY - rect.top - lensSize / 2;

    const maxX = rect.width - lensSize ;
    const maxY = rect.height - lensSize;

    x = Math.max(0, Math.min(x, maxX)) ;
    y = Math.max(0, Math.min(y, maxY));

    setLensPosition({ x, y });
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    setIsZoomed(false);
    setLensPosition({ x: 0, y: 0 });
  };

  const handleMainImageClick = () => {
    // Useful on touch devices where mouse hover is unavailable.
    setIsZoomed((previous) => !previous);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 lg:h-[600px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const stock = calculateStock(product.quantity, product.sold);
  const inStock = isInStock(product.quantity, product.sold);

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-indigo-600 transition-colors">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to={`/category/${product.category?.slug}`}
          className="hover:text-indigo-600 transition-colors"
        >
          {product.category?.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shopping
      </button>
{/* PRODUCT SEO SCHEMA — include only once */}
<ProductJsonLd product={product} />
      
              {/* 2. INJECT PRODUCT SCHEMA HERE 
            <ProductJsonLd product={product} />*/}

      
{/* PRODUCT IMAGES + AMAZON STYLE MAGNIFIER */}
{/* MAIN PRODUCT DETAIL LAYOUT */}
{/* grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 */}
{/* 
    grid grid-cols-1
    lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]
    gap-8 xl:gap-12
    items-start
    w-full */}
<div className=" grid grid-cols-1
    lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]
    gap-4 xl:gap-12
    items-start
    w-full  ">

  <ProductJsonLd product={product} />

{/* LEFT: PRODUCT IMAGE GALLERY */}

<div className="min-w-0 w-full">

  <div className="relative flex flex-col sm:flex-row gap-4 xl:gap-5">

    {/* THUMBNAIL COLUMN */}

    <div
      className="
        flex flex-row sm:flex-col
        gap-3
        overflow-x-auto
        sm:overflow-x-hidden sm:overflow-y-auto
        sm:max-h-[620px]
        order-2 sm:order-1
        flex-shrink-0
        pb-2 sm:pb-0
      "
    >

      {galleryImages.map((image, index) => (

        <button
          key={`${image}-${index}`}
          type="button"
          onClick={() => handleThumbnailClick(index)}
          className={cn(
            "flex-shrink-0 w-16 h-16 xl:w-[76px] xl:h-[76px]",
            "rounded-lg overflow-hidden",
            "border-2 p-1 bg-white dark:bg-gray-800",
            "transition-all duration-200",
            selectedImage === index
              ? "border-orange-500 shadow-md"
              : "border-gray-200 dark:border-gray-700 hover:border-orange-400"
          )}
          aria-label={`View product image ${index + 1}`}
          aria-pressed={selectedImage === index}
        >

          <img
            src={image}
            alt={`${product.name} view ${index + 1}`}
            className="w-full h-full object-contain"
          />

        </button>

      ))}

    </div>


    {/* MAIN IMAGE + MAGNIFYING LENS */}

    <div className="relative flex-1   min-w-0 order-1 sm:order-2">

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full"
      >

        <div
          className={cn(
            "relative aspect-square w-full    max-w-[620px]",
            "rounded-2xl",
            "bg-gray-50 dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "overflow-hidden select-none",
            "cursor-crosshair"
          )}

          onMouseEnter={() => setIsZoomed(true)}

          onMouseLeave={() => setIsZoomed(false)}

          onMouseMove={handleImageMouseMove}

          onClick={handleMainImageClick}
        >

          {/* MAIN PRODUCT IMAGE */}

          <img
            key={activeImage}
            src={activeImage}
            alt={product.name}
            draggable="false"
            className="
              absolute inset-0
              w-full h-full
              object-contain
              p-3
              pointer-events-none
            "
          />


          {/* MAGNIFYING LENS */}

          {isZoomed && (

            <div
              className="
                absolute   
                border border-gray-500
                bg-white/30
                pointer-events-none
                z-20
                shadow-sm
              "
              style={{
                width: `${lensSize}px`,
                height: `${lensSize}px`,
                left: `${lensPosition.x }px`,
                top: `${lensPosition.y}px`,
                backdropFilter: 'brightness(1.05)'
              }}
            />

          )}


          {/* PRODUCT BADGES */}

          {product.sold > 10 && (

            <div className="absolute top-4 left-4 z-30">
              <Badge variant="danger">
                {product.sold} sold
              </Badge>
            </div>

          )}

          {stock <= 5 && stock > 0 && (

            <div className="absolute top-4 right-4 z-30">
              <Badge variant="warning">
                Only {stock} left
              </Badge>
            </div>

          )}


          {/* OUT OF STOCK */}

          {!inStock && (

            <div className="
              absolute inset-0
              bg-black/50
              flex items-center justify-center
              z-30
            ">

              <span className="text-white text-2xl font-bold">
                Out of Stock
              </span>

            </div>

          )}


          {/* ZOOM ICON */}

          <div className="
            absolute bottom-4 right-4 z-30
            bg-white/90 backdrop-blur
            p-3 rounded-lg shadow
          ">

            <ZoomIn className="h-5 w-5 text-gray-700" />

          </div>

        </div>

      </motion.div>


      {/* AMAZON-STYLE SIDE-BY-SIDE ZOOM RESULT */}

      <div
        className={cn(
          "hidden xl:block",
          "absolute z-50",
          "left-[calc(100%+16px)] top-0",
          "w-[min(560px,42vw)] h-[min(560px,42vw)]",
          "border border-gray-300 dark:border-gray-600",
          "shadow-xl rounded-lg",
          "bg-white dark:bg-gray-800",
          "pointer-events-none",
          "transition-opacity duration-150",
          isZoomed
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        )}

        style={{
          backgroundImage: `url("${activeImage}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
          backgroundPosition: `-${lensPosition.x * zoomLevel}px -${lensPosition.y * zoomLevel}px`
        }}
      />

    </div>

  </div>


  {/* IMAGE COUNTER */}

  <div className="flex justify-center items-center gap-2 mt-4">

    <span className="text-sm text-gray-500 dark:text-gray-400">
      Image {selectedImage + 1} of {galleryImages.length}
    </span>

    <span className="flex gap-1">

      {galleryImages.map((_, index) => (

        <span
          key={index}
          className={cn(
            "w-2 h-2 rounded-full",
            selectedImage === index
              ? "bg-indigo-600"
              : "bg-gray-300 dark:bg-gray-600"
          )}
        />

      ))}

    </span>

  </div>

  <p className="text-xs text-center text-gray-400 mt-2">
    Hover over the image to magnify. On touch devices, tap the image to zoom.
  </p>

</div>

  {/* RIGHT: PRODUCT INFORMATION */}
  {/* space-y-6 min-w-0 */}

  <div className=" w-full min-w-0
  space-y-7
  lg:pl-2
  xl:pl-4">

    {/* PRODUCT TITLE */}
    {/* text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 */}

    <div>

      <h1 className="text-3xl xl:text-4xl
  font-bold
  text-gray-900 dark:text-gray-100
  mb-4
  leading-tight">
        {product.name}
      </h1>

      <div className="mb-4">
        <Badge variant="secondary">
          {product.category?.name}
        </Badge>
      </div>

      {/* PRICE */}
      {/*   text-4xl font-bold text-indigo-600 */}

      <div className="flex items-baseline gap-3 flex-wrap">

        <span className="text-4xl xl:text-5xl font-bold text-indigo-600">
          {formatCurrency(product.price)}
        </span>

        {product.price > 100 && (

          <span className="text-sm text-green-600 font-medium">
            Free Shipping
          </span>

        )}

      </div>

    </div>


    {/* DESCRIPTION */}

    <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">

      <p>{product.description}</p>

    </div>


    {/* QUANTITY + CART */}

    <div className="space-y-4">

      <div className="flex items-center gap-4 flex-wrap">

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quantity:
        </span>

        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">

          <button
            onClick={() => handleQuantityChange('decrease')}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="px-4 py-2 min-w-[50px] text-center text-gray-900 dark:text-gray-100">
            {quantity}
          </span>

          <button
            onClick={() => handleQuantityChange('increase')}
            disabled={quantity >= stock}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300"
          >
            <Plus className="h-4 w-4" />
          </button>

        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {stock} available
        </span>

      </div>


      <div className="flex gap-3 flex-wrap">

        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            handleAddToCart();
            navigate('/cart');
          }}
          disabled={!inStock}
        >
          Buy Now
        </Button>

        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>

      </div>

    </div>


    {/* PRODUCT FEATURES */}

    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200 dark:border-gray-700">

      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Truck className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Fast Delivery
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            2-3 business days
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Shield className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Secure Payment
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            100% protected
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Package className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Free Returns
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            30-day policy
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Clock className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            24/7 Support
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dedicated help
          </p>
        </div>
      </div>

    </div>


    {/* PRODUCT METADATA */}

    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">

      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <span>
          SKU: {product.id?.substring(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span>
          Added {moment(product.createdAt).fromNow()}
        </span>
      </div>

    </div>

  </div>

</div>

    

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}