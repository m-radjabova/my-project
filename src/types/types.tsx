export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[],
  uid: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; 
  category_id: string;
  image: string;
  weight: string;
  rating: number;
  rating_count: number;
  createdAt: string;
  quantity: number;
}

export interface CarouselItem {
  id: string;
  title1: string;
  title2: string;
  description: string;
  img: string;
  createdAt: string;
}


export interface OrderProduct {
  id: string;
  product: Product;
  price: number;
  quantity: number;
  totalPrice: number;
  name: string;
  imageUrl: string;
  weight: string;
  rating: number;
  description: string;
  createdAt: Date;
}

export interface OrderProductApi {
  id?: string | number;
  product_id?: string | number;
  name?: string;
  quantity?: number;
  price?: number;
  total_price?: number;
  image?: string;
  weight?: string;
  description?: string;
  rating?: number;
  created_at?: string | number | Date;
}

export interface GroupedOrderProduct extends OrderProductApi {
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  totalPrice: number;
  products: OrderProduct[];
  createdAt: Date;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  deliveryDate: string;
  location: {  
    lat: number;
    lng: number;
  };
  phone: string;
}

export interface Reviews {
  id?: string;
  title: string;
  rating: number;
  userId: string;
  created_at: number;
}
