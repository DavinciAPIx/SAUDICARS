export interface Car {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  price: number;
  rating: number;
  reviewCount: number;
  distance: number;
  featured: boolean;
  instantBooking: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  specifications: {
    transmission: string;
    seats: number;
    doors: number;
    fuelType: string;
    mileageLimit: number;
  };
  features: string[];
  rules: {
    smoking: boolean;
    pets: boolean;
    additionalDrivers: boolean;
    minimumAge: number;
  };
}

export interface CarFilterOptions {
  priceMin?: number;
  priceMax?: number;
  distance?: number;
  instantBooking?: boolean;
  features?: string[];
  carType?: string;
  sortBy?: 'price' | 'distance' | 'rating';
}