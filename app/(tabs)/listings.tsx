import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Plus, Car, Tag, Settings } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Car as CarType } from '@/types/Car';
import { getCarsByUserId } from '@/services/cars';
import { router } from 'expo-router';

type ListingStatus = 'active' | 'inactive' | 'pending' | 'all';

export default function ListingsScreen() {
  const { t, isRTL } = useI18n();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [listings, setListings] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ListingStatus>('all');

  useEffect(() => {
    loadUserListings();
  }, []);

  const loadUserListings = async () => {
    if (user) {
      try {
        setIsLoading(true);
        // In a real app, we'd be using user.id rather than a mock user ID
        const userListings = await getCarsByUserId('user-1'); // Using mock user ID for demo
        setListings(userListings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user listings:', error);
        setIsLoading(false);
      }
    }
  };

  const renderStatusFilter = () => (
    <View style={styles.statusFilterContainer}>
      {(['all', 'active', 'inactive', 'pending'] as ListingStatus[]).map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusButton,
            selectedStatus === status && { backgroundColor: colors.primary },
            { borderColor: colors.border }
          ]}
          onPress={() => setSelectedStatus(status)}
        >
          <Text style={[
            styles.statusButtonText,
            selectedStatus === status && { color: 'white' },
            { 
              color: selectedStatus === status ? 'white' : colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t(`listings.${status === 'all' ? 'myListings' : status}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Car size={60} color={colors.textSecondary} />
      <Text style={[
        styles.emptyStateTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        No listings yet
      </Text>
      <Text style={[
        styles.emptyStateSubtitle,
        { 
          color: colors.textSecondary,
          fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
        }
      ]}>
        Start earning by renting out your car
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-listing')}
      >
        <Text style={[
          styles.addButtonText,
          { fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold' }
        ]}>
          {t('listings.addNewListing')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderListingItem = ({ item }: { item: CarType }) => (
    <TouchableOpacity
      style={[styles.listingCard, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/listing/${item.id}`)}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.listingImage}
        resizeMode="cover"
      />
      <View style={[
        styles.statusBadge, 
        { backgroundColor: getStatusColor(item.instantBooking) }
      ]}>
        <Text style={[
          styles.statusBadgeText,
          { fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium' }
        ]}>
          {item.instantBooking ? t('listings.active') : t('listings.pending')}
        </Text>
      </View>
      <View style={styles.listingInfo}>
        <Text style={[
          styles.listingName,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
          }
        ]}>
          {item.make} {item.model} {item.year}
        </Text>
        <View style={styles.listingDetails}>
          <View style={styles.detailItem}>
            <Tag size={16} color={colors.primary} />
            <Text style={[
              styles.detailText,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {item.price} {t('common.sar')}/{t('common.day')}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Settings size={16} color={colors.textSecondary} />
            <Text style={[
              styles.detailText,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {item.specifications.transmission}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (isActive: boolean) => {
    if (isActive) {
      return colors.success;
    }
    return colors.warning;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {t('listings.myListings')}
        </Text>
        <TouchableOpacity
          style={[styles.addListingButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/add-listing')}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {renderStatusFilter()}
      
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listingsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addListingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  statusButtonText: {
    fontSize: 14,
  },
  listingsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 160,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  listingInfo: {
    padding: 16,
  },
  listingName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  listingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});