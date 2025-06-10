import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Search, MapPin, FileSliders as Sliders, Star, MapPinned } from 'lucide-react-native';
import { getCars } from '@/services/cars';
import { Car } from '@/types/Car';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { t, isRTL } = useI18n();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyCars, setNearbyCars] = useState<Car[]>([]);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [popularCars, setPopularCars] = useState<Car[]>([]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsLoading(true);
        const carsData = await getCars();
        
        // Filter cars into categories (in a real app, this would be done on the server)
        setNearbyCars(carsData.filter(car => car.distance < 10).slice(0, 5));
        setFeaturedCars(carsData.filter(car => car.featured).slice(0, 5));
        setPopularCars(carsData.filter(car => car.rating > 4.5).slice(0, 5));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cars:', error);
        setIsLoading(false);
      }
    };
    
    loadCars();
  }, []);

  const renderCarItem = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={[styles.carCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/car/${item.id}`)}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.carInfo}>
        <Text style={[
          styles.carName,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
          }
        ]}>
          {item.make} {item.model}
        </Text>
        <View style={styles.carDetails}>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.accent} fill={colors.accent} />
            <Text style={[
              styles.ratingText,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {item.rating}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={[
              styles.locationText,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {item.distance} km
            </Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={[
            styles.priceValue,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
            }
          ]}>
            {item.price} {t('common.sar')}
          </Text>
          <Text style={[
            styles.pricePerDay,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
          ]}>
            /{t('common.day')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCarList = (title: string, data: Car[], viewAllAction: () => void) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[
          styles.sectionTitle,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {title}
        </Text>
        <TouchableOpacity onPress={viewAllAction}>
          <Text style={[
            styles.viewAllText,
            { 
              color: colors.primary,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t('common.seeAll')}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carList}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[
              styles.greeting,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {t('home.greeting')}
            </Text>
            <Text style={[
              styles.findCarText,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
              }
            ]}>
              {t('home.findCar')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.mapButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => router.push('/map')}
          >
            <MapPinned size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[
          styles.searchContainer,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }
        ]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}
            placeholder={t('common.search')}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[styles.filtersButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => router.push('/filters')}
          >
            <Sliders size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderCarList(
          t('home.nearbyTitle'), 
          nearbyCars, 
          () => router.push('/search?filter=nearby')
        )}
        
        {renderCarList(
          t('home.featuredTitle'), 
          featuredCars, 
          () => router.push('/search?filter=featured')
        )}
        
        {renderCarList(
          t('home.popularTitle'), 
          popularCars, 
          () => router.push('/search?filter=popular')
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  findCarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
    fontSize: 16,
  },
  filtersButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  carList: {
    paddingHorizontal: 16,
  },
  carCard: {
    width: 260,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carImage: {
    width: '100%',
    height: 160,
  },
  carInfo: {
    padding: 16,
  },
  carName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricePerDay: {
    fontSize: 14,
    marginLeft: 2,
  },
  loader: {
    marginVertical: 20,
  },
});