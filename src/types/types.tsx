export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[]
}


export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number; 
  categoryId: string;
  imageUrl: string;
  weight: string;
  rating: number;
}
