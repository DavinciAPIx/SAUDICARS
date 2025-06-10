import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Search as SearchIcon, FileSliders as Sliders, Star, MapPin } from 'lucide-react-native';
import { searchCars } from '@/services/cars';
import { Car, CarFilterOptions } from '@/types/Car';

export default function SearchScreen() {
  const { t, isRTL } = useI18n();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CarFilterOptions>({});
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating'>('distance');

  useEffect(() => {
    // Apply filter from route params if available
    if (params.filter) {
      const filter = params.filter as string;
      
      switch (filter) {
        case 'nearby':
          setFilters({ distance: 10 });
          break;
        case 'featured':
          // For demo, we'll just load all and filter in the component
          break;
        case 'popular':
          setSortBy('rating');
          break;
        default:
          break;
      }
    }
    
    loadCars();
  }, [params]);

  const loadCars = async () => {
    try {
      setIsLoading(true);
      const results = await searchCars(searchQuery, filters);
      
      // Sort results
      let sortedResults = [...results];
      switch (sortBy) {
        case 'price':
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case 'distance':
          sortedResults.sort((a, b) => a.distance - b.distance);
          break;
        case 'rating':
          sortedResults.sort((a, b) => b.rating - a.rating);
          break;
      }
      
      // Filter for featured if needed
      if (params.filter === 'featured') {
        sortedResults = sortedResults.filter(car => car.featured);
      }
      
      setCars(sortedResults);
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching cars:', error);
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadCars();
  };

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
      {item.instantBooking && (
        <View style={[styles.instantBadge, { backgroundColor: colors.primary }]}>
          <Text style={[
            styles.instantBadgeText,
            { 
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t('home.instantBooking')}
          </Text>
        </View>
      )}
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
              {item.rating} ({item.reviewCount})
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

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[
            styles.loadingText,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t('common.loading')}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          source={{ 
            uri: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }}
          style={styles.emptyStateImage}
          resizeMode="contain"
        />
        <Text style={[
          styles.emptyStateTitle,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {t('home.noResults')}
        </Text>
        <Text style={[
          styles.emptyStateSubtitle,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {t('home.tryAdjustingFilters')}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[
        styles.searchContainer,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }
      ]}>
        <SearchIcon size={20} color={colors.textSecondary} />
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
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.filtersButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => router.push('/filters')}
        >
          <Sliders size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.sortOptions}>
        <Text style={[
          styles.sortByText,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          {t('home.sortBy')}:
        </Text>
        <ScrollableOptions
          options={[
            { value: 'distance', label: t('home.distance') },
            { value: 'price', label: t('home.price') },
            { value: 'rating', label: t('home.rating') },
          ]}
          selectedValue={sortBy}
          onSelect={(value) => {
            setSortBy(value as 'price' | 'distance' | 'rating');
            loadCars();
          }}
          colors={colors}
          isRTL={isRTL}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.carList}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

type Option = {
  value: string;
  label: string;
};

type ScrollableOptionsProps = {
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  colors: any;
  isRTL: boolean;
};

const ScrollableOptions = ({ 
  options, 
  selectedValue, 
  onSelect, 
  colors, 
  isRTL 
}: ScrollableOptionsProps) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.optionButton,
            selectedValue === option.value && { 
              backgroundColor: colors.primaryLight,
              borderColor: colors.primary,
            },
            { 
              borderColor: colors.border,
              backgroundColor: selectedValue === option.value ? colors.primaryLight : colors.card,
            }
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[
            styles.optionText,
            selectedValue === option.value && { color: colors.primary },
            { 
              color: selectedValue === option.value ? colors.primary : colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
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
  sortOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sortByText: {
    fontSize: 16,
    marginRight: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
  },
  carList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  carCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carImage: {
    width: '100%',
    height: 200,
  },
  instantBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  instantBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  carInfo: {
    padding: 16,
  },
  carName: {
    fontSize: 18,
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
    fontSize: 14,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pricePerDay: {
    fontSize: 14,
    marginLeft: 2,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});