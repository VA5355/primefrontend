import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
// 1. IMPORT YOUR GLOBAL SCHEMA
import { GlobalSchema } from './components/GlobalSchema.jsx'; 

//import Menu from './components/nav/Menu.jsx'; 
import Menu from './components/nav/PrimeMenu.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import Footer from './components/layout/Footer.jsx';
import { useCartDrawer } from './context/cartDrawer';
import {ReduxProvider} from './providers/ReduxProvider'
import { ModalProvider } from './providers/ModalProvider';
import NotFound from './pages/NotFound';
import Home from './pages/Home'; 
import PrimeComputerHome from './pages/PrimeComputerHome'; 
import Shop from './pages/Shop';
import ProductView from './pages/ProductView';
import Search from './pages/Search';
import CategoriesList from './pages/CategoriesList';
import CategoryView from './pages/CategoryView';
import Collections from './pages/Collections';
import CollectionView from './pages/CollectionView';
import Cart from './pages/Cart';
//import Checkout from './pages/Checkout';
//import Checkout from './pages/Checkout-withBharatPe.jsx';
import Checkout from './pages/Checkout-withBharatPeModal';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import BraintreeCallback from './pages/braintree/BraintreeCallback';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCategory from './pages/admin/AdminCategory.jsx';
import AdminProduct from './pages/admin/AdminProduct.jsx';
import AdminProductScanForm from './pages/admin/AdminProductScanForm.jsx';
import SearchProductScan from './pages/SearchProductScan.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductUpdate from './pages/admin/AdminProductUpdate.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import UserDashboard from './pages/user/UserDashboard.jsx';
import UserProfile from './pages/user/UserProfile.jsx';
import UserOrders from './pages/user/UserOrders.jsx';
import UserRoute from './components/routes/UserRoute.jsx';
import UserReadOnlyRoute from './components/routes/UserReadOnlyRoute.jsx';
import AdminRoute from './components/routes/AdminRoute.jsx';
import CustomerOnboarding from './pages/CustomerOnboarding.jsx';
import VyaparBharatPeSuccess from './pages/VyaparBharatPeSuccess.jsx';
import LayoutDesigner from './pages/admin/LayoutDesigner2Templates.jsx';


const PageNotFound = () =>
{
  return (
    <div
      className='flex justify-center items-center h-screen'>
      <div className='text-2xl text-gray-600'>404 | Page not found</div>
    </div>
  );
};

function AppContent() {
  const [cartDrawerOpen, setCartDrawerOpen] = useCartDrawer();
  const [vyaparkey , setVyaparkey] = useState(process.env.REACT_APP_VYAPAR_PROD_KEY)
  return (
    <>
          {/* 2. INJECT GLOBAL SCHEMA HERE */}
      <GlobalSchema />
         {/** now points to <PrimeMenu/> */}
      <Menu />
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <Toaster position='top-right' />
      <Routes>
        <Route>
          <Route path='/home' element={ <Home /> } />
          <Route path='/' element={ <PrimeComputerHome /> } />
          <Route path='/shop' element={ <Shop /> } />
          <Route path='/categories' element={ <CategoriesList /> } />
          <Route path='/category/:slug' element={ <CategoryView /> } />
          <Route path='/collections' element={ <Collections /> } />
          <Route path='/collections/:slug' element={ <CollectionView /> } />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/checkout' element={ <ReduxProvider>  <ModalProvider>  <Checkout /> </ModalProvider>  </ReduxProvider> } />
          <Route path='/vyaparbharatpesuccess' element={ <ReduxProvider>  <ModalProvider>  <VyaparBharatPeSuccess apiKey={vyaparkey} /> </ModalProvider>  </ReduxProvider> } />

          <Route path='/search' element={ <Search /> } />
          <Route path='/product/:slug' element={ <ProductView /> } />
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register /> } />
          <Route path='/forgot-password' element={ <ForgotPassword /> } />
          <Route path='/reset-password' element={ <ResetPassword /> } />
          <Route path='/braintree-rediect' element={ <BraintreeCallback /> } />
          <Route path='/customeronboarding' element={ <CustomerOnboarding /> } />
        {/* Under Construction / Coming Soon Routes */}
          <Route path="/shipping" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/returns" element={<NotFound />} />
          <Route path="/support" element={<NotFound />} />
          <Route path='/dashboard' element={ <UserRoute /> } >
            <Route path='user' element={ <UserDashboard /> } />
            <Route path='user/profile' element={ <UserProfile /> } />
            <Route path='user/orders' element={ <UserOrders /> } />
          </Route>
           <Route path='/scansearch' element={ <UserReadOnlyRoute /> } >
    
              <Route path='admin/scanproduct' element={  <ReduxProvider>  <ModalProvider>   <SearchProductScan /></ModalProvider>  </ReduxProvider> } />
         </Route>
          <Route path='/dashboard' element={ <AdminRoute /> } >
            
            <Route path='admin' element={ <AdminDashboard /> } />
            <Route path='admin/category' element={ <AdminCategory /> } />
            <Route path='admin/product' element={  <ReduxProvider>  <ModalProvider>   <AdminProduct /></ModalProvider>  </ReduxProvider> } />
            <Route path='admin/scanproduct' element={  <ReduxProvider>  <ModalProvider>   <AdminProductScanForm /></ModalProvider>  </ReduxProvider> } />
            <Route path='admin/designer' element={  <ReduxProvider>  <ModalProvider>   <LayoutDesigner /></ModalProvider>  </ReduxProvider> } />
            <Route path='admin/products' element={ <AdminProducts /> } />
            <Route
              path="admin/product/update/:slug"
              element={ <AdminProductUpdate /> }
            />
            <Route path='admin/orders' element={ <AdminOrders /> } />
           
          </Route>


        </Route>
        <Route path='*' element={ <PageNotFound /> } />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

