import { Car } from '@/types/Car';
import { supabase } from './supabase';

// Mock car data for the app (in a real app, this would come from Supabase)
const mockCars: Car[] = [
  {
    id: 'car-1',
    userId: 'user-2',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    color: 'White',
    price: 200,
    rating: 4.8,
    reviewCount: 24,
    distance: 3.2,
    featured: true,
    instantBooking: true,
    location: {
      latitude: 24.7136,
      longitude: 46.6753,
      address: 'King Fahd Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 300
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Backup camera',
      'USB charger'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 21
    }
  },
  {
    id: 'car-2',
    userId: 'user-3',
    make: 'Lexus',
    model: 'ES',
    year: 2022,
    color: 'Black',
    price: 350,
    rating: 4.9,
    reviewCount: 18,
    distance: 5.7,
    featured: true,
    instantBooking: true,
    location: {
      latitude: 24.7275,
      longitude: 46.6849,
      address: 'Al Olaya St, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1005633/pexels-photo-1005633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 250
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Sunroof'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 25
    }
  },
  {
    id: 'car-3',
    userId: 'user-4',
    make: 'Nissan',
    model: 'Patrol',
    year: 2020,
    color: 'Silver',
    price: 400,
    rating: 4.7,
    reviewCount: 32,
    distance: 8.1,
    featured: false,
    instantBooking: false,
    location: {
      latitude: 24.6877,
      longitude: 46.7219,
      address: 'King Abdullah Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 7,
      doors: 5,
      fuelType: 'Gasoline',
      mileageLimit: 200
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Sunroof',
      '4WD',
      'Cooled seats'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 25
    }
  },
  {
    id: 'car-4',
    userId: 'user-5',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    color: 'Gray',
    price: 450,
    rating: 4.9,
    reviewCount: 14,
    distance: 2.4,
    featured: true,
    instantBooking: true,
    location: {
      latitude: 24.7104,
      longitude: 46.6601,
      address: 'Tahlia St, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/4037753/pexels-photo-4037753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/9733240/pexels-photo-9733240.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3849535/pexels-photo-3849535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 150
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Sunroof',
      'Premium sound system',
      'Heated seats'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: false,
      minimumAge: 30
    }
  },
  {
    id: 'car-5',
    userId: 'user-6',
    make: 'BMW',
    model: '5 Series',
    year: 2022,
    color: 'Blue',
    price: 480,
    rating: 4.8,
    reviewCount: 21,
    distance: 6.3,
    featured: true,
    instantBooking: true,
    location: {
      latitude: 24.7512,
      longitude: 46.6930,
      address: 'King Salman Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 200
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Sunroof',
      'Premium sound system',
      'Heated seats',
      'Wireless charging'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 25
    }
  },
  {
    id: 'car-6',
    userId: 'user-7',
    make: 'Hyundai',
    model: 'Accent',
    year: 2021,
    color: 'White',
    price: 150,
    rating: 4.6,
    reviewCount: 38,
    distance: 4.9,
    featured: false,
    instantBooking: true,
    location: {
      latitude: 24.6748,
      longitude: 46.7177,
      address: 'Al Takhassusi St, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/13442611/pexels-photo-13442611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/11782927/pexels-photo-11782927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/12207241/pexels-photo-12207241.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 350
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'USB charger'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 21
    }
  },
  {
    id: 'car-7',
    userId: 'user-8',
    make: 'Kia',
    model: 'Sportage',
    year: 2022,
    color: 'Red',
    price: 220,
    rating: 4.7,
    reviewCount: 29,
    distance: 7.2,
    featured: false,
    instantBooking: true,
    location: {
      latitude: 24.7334,
      longitude: 46.7110,
      address: 'Eastern Ring Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 5,
      fuelType: 'Gasoline',
      mileageLimit: 300
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Backup camera',
      'USB charger'
    ],
    rules: {
      smoking: false,
      pets: true,
      additionalDrivers: true,
      minimumAge: 21
    }
  },
  {
    id: 'car-8',
    userId: 'user-9',
    make: 'Range Rover',
    model: 'Sport',
    year: 2021,
    color: 'Black',
    price: 700,
    rating: 4.9,
    reviewCount: 16,
    distance: 9.5,
    featured: true,
    instantBooking: false,
    location: {
      latitude: 24.6942,
      longitude: 46.7077,
      address: 'Prince Turki St, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/7813177/pexels-photo-7813177.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5191146/pexels-photo-5191146.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/7813178/pexels-photo-7813178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 5,
      fuelType: 'Gasoline',
      mileageLimit: 100
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Sunroof',
      'Premium sound system',
      'Heated seats',
      'Cooled seats',
      '4WD',
      'Wireless charging'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: false,
      minimumAge: 30
    }
  },
  {
    id: 'car-9',
    userId: 'user-10',
    make: 'Honda',
    model: 'Accord',
    year: 2020,
    color: 'Silver',
    price: 190,
    rating: 4.5,
    reviewCount: 42,
    distance: 3.8,
    featured: false,
    instantBooking: true,
    location: {
      latitude: 24.7241,
      longitude: 46.6266,
      address: 'Al Urubah Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 5,
      doors: 4,
      fuelType: 'Gasoline',
      mileageLimit: 300
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Backup camera',
      'USB charger'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 21
    }
  },
  {
    id: 'car-10',
    userId: 'user-11',
    make: 'Chevrolet',
    model: 'Tahoe',
    year: 2022,
    color: 'Black',
    price: 380,
    rating: 4.8,
    reviewCount: 27,
    distance: 6.7,
    featured: false,
    instantBooking: false,
    location: {
      latitude: 24.6488,
      longitude: 46.7152,
      address: 'Southern Ring Rd, Riyadh'
    },
    images: [
      'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ],
    specifications: {
      transmission: 'Automatic',
      seats: 7,
      doors: 5,
      fuelType: 'Gasoline',
      mileageLimit: 250
    },
    features: [
      'Air conditioning',
      'Bluetooth',
      'Navigation',
      'Leather seats',
      'Backup camera',
      '4WD',
      'Premium sound system'
    ],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: 25
    }
  }
];

// Get all cars
export const getCars = async (): Promise<Car[]> => {
  try {
    // In a real app, this would query the Supabase cars table
    // const { data, error } = await supabase
    //   .from('cars')
    //   .select('*')
    //   .eq('is_approved', true)
    //   .eq('is_active', true);
    
    // if (error) throw error;
    
    // For now, simulate API delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockCars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

// Get a car by ID
export const getCarById = async (id: string): Promise<Car | null> => {
  try {
    // In a real app, this would query the Supabase cars table
    // const { data, error } = await supabase
    //   .from('cars')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (error) throw error;
    
    // For now, simulate API delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCars.find(car => car.id === id) || null;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
};

// Get cars by user ID
export const getCarsByUserId = async (userId: string): Promise<Car[]> => {
  try {
    // In a real app, this would query the Supabase cars table
    // const { data, error } = await supabase
    //   .from('cars')
    //   .select('*')
    //   .eq('owner_id', userId);
    
    // if (error) throw error;
    
    // For now, simulate API delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockCars.filter(car => car.userId === userId);
  } catch (error) {
    console.error('Error fetching user cars:', error);
    return [];
  }
};

// Search cars
export const searchCars = async (
  query: string,
  filters?: {
    priceMin?: number;
    priceMax?: number;
    distance?: number;
    instantBooking?: boolean;
    features?: string[];
    carType?: string;
  }
): Promise<Car[]> => {
  try {
    // In a real app, this would use Supabase's full-text search and filters
    // let queryBuilder = supabase
    //   .from('cars')
    //   .select('*')
    //   .eq('is_approved', true)
    //   .eq('is_active', true);
    
    // if (query) {
    //   queryBuilder = queryBuilder.textSearch('fts', query);
    // }
    
    // Apply filters...
    
    // For now, simulate API delay and filter mock data
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let filteredCars = [...mockCars];
    
    // Apply text search
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filteredCars = filteredCars.filter(car => 
        car.make.toLowerCase().includes(lowercaseQuery) ||
        car.model.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.priceMin !== undefined) {
        filteredCars = filteredCars.filter(car => car.price >= filters.priceMin!);
      }
      
      if (filters.priceMax !== undefined) {
        filteredCars = filteredCars.filter(car => car.price <= filters.priceMax!);
      }
      
      if (filters.distance !== undefined) {
        filteredCars = filteredCars.filter(car => car.distance <= filters.distance!);
      }
      
      if (filters.instantBooking !== undefined) {
        filteredCars = filteredCars.filter(car => car.instantBooking === filters.instantBooking);
      }
      
      if (filters.features && filters.features.length > 0) {
        filteredCars = filteredCars.filter(car => 
          filters.features!.every(feature => 
            car.features.includes(feature)
          )
        );
      }
    }
    
    return filteredCars;
  } catch (error) {
    console.error('Error searching cars:', error);
    return [];
  }
};