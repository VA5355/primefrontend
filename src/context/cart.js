import { useState, createContext, useContext, useEffect } from 'react';

const CartContext = createContext();
/**
 * 
 * Sample cart 
 * [{"id":"55876c92-913c-4199-98ab-bca223a4f005","name":"Kate Spade Tote","slug":"kate-spade-tote",
 * "description":"Large leather tote bag.","price":"358.99","quantity":20,"sold":15,
 * "photoPath":"/uploads/products/kate-spade-tote-1757862445657.jpg","photoContentType":"image/jpeg",
 * "shipping":true,"categoryId":"090be721-a44b-4090-bdfb-d4b487e85980","createdAt":"2026-07-18T00:45:26.437Z",
 * "updatedAt":"2026-07-18T00:47:30.072Z","category":{"id":"090be721-a44b-4090-bdfb-d4b487e85980",
 * "name":"Clothing & Accessories","slug":"clothing-accessories"}}]
 * 
 * @param {*} param0 
 * @returns 
 */
const CartProvider = ( { children } ) =>
{
  const [ cart, setCart ] = useState( [] );

  useEffect( () =>
  {
    let existingCart = localStorage.getItem( "cart" );
    if ( existingCart )
      setCart( JSON.parse( existingCart ) );

  }, [] );

  return (
    < CartContext.Provider value={ [ cart, setCart ] }>
      { children }
    </ CartContext.Provider>
  );
};

const useCart = () => useContext( CartContext );

export { useCart, CartProvider };
