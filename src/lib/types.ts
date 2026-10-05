export interface ProductProps {
  id: number | string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface StoreProduct extends ProductProps {
  quantity: number;
}

export interface RootState {
  next: {
    productData: StoreProduct[];
    favoriteData: StoreProduct[];
    userInfo: any | null;
  };
}