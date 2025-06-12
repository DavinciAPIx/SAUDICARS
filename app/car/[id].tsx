import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ArrowLeft, Heart, Share, Star, MapPin, Users, Fuel, Settings, Calendar, Shield, MessageSquare, Phone, CircleCheck as CheckCircle, Clock, Car, Zap } from 'lucide-react-native';
import { getCarById } from '@/services/cars';
import { Car } from '@/types/Car';

const { width } = Dimensions.get('window');

export default function CarDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, isRTL } = useI18n();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews'>('overview');

  useEffect(() => {
    if (id) {
      loadCarDetails();
    }
  }, [id]);

  const loadCarDetails = async () => {
    try {
      setIsLoading(true);
      const carData = await getCarById(id);
      setCar(carData);
    } catch (error) {
      console.error('Error loading car details:', error);
      Alert.alert('Error', 'Failed to load car details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Share', 'Share functionality would be implemented here');
    }
  };

  const handleBooking = () => {
    if (car) {
      router.push(`/booking/${car.id}`);
    }
  };

  const handleContact = () => {
    if (car) {
      router.push(`/chat/${car.userId}`);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!car) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Car not found</Text>
        <TouchableOpacity
          style={[styles.backToHomeButton, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backToHomeText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: colors.card }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={handleShare}
        >
          <Share size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            size={20} 
            color={isFavorite ? colors.error : colors.text}
            fill={isFavorite ? colors.error : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
      >
        {car.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.carImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      <View style={styles.imageIndicators}>
        {car.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              selectedImageIndex === index && { backgroundColor: colors.primary },
              { backgroundColor: selectedImageIndex === index ? colors.primary : 'rgba(255,255,255,0.5)' }
            ]}
          />
        ))}
      </View>

      {car.instantBooking && (
        <View style={[styles.instantBadge, { backgroundColor: colors.primary }]}>
          <Zap size={16} color="white" />
          <Text style={[
            styles.instantBadgeText,
            { fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium' }
          ]}>
            Instant Booking
          </Text>
        </View>
      )}
    </View>
  );

  const renderCarInfo = () => (
    <View style={[styles.carInfoContainer, { backgroundColor: colors.card }]}>
      <View style={styles.carHeader}>
        <View style={styles.carTitleContainer}>
          <Text style={[
            styles.carTitle,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
            }
          ]}>
            {car.make} {car.model}
          </Text>
          <Text style={[
            styles.carYear,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            {car.year}
          </Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.accent} fill={colors.accent} />
          <Text style={[
            styles.ratingText,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {car.rating}
          </Text>
          <Text style={[
            styles.reviewCount,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            ({car.reviewCount})
          </Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <MapPin size={16} color={colors.textSecondary} />
        <Text style={[
          styles.locationText,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {car.location.address} • {car.distance} km away
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[
          styles.priceValue,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {car.price} SAR
        </Text>
        <Text style={[
          styles.priceUnit,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          /day
        </Text>
      </View>
    </View>
  );

  const renderSpecifications = () => (
    <View style={[styles.specificationsContainer, { backgroundColor: colors.card }]}>
      <Text style={[
        styles.sectionTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Specifications
      </Text>
      
      <View style={styles.specsGrid}>
        <View style={styles.specItem}>
          <Users size={20} color={colors.primary} />
          <Text style={[
            styles.specLabel,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Seats
          </Text>
          <Text style={[
            styles.specValue,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {car.specifications.seats}
          </Text>
        </View>

        <View style={styles.specItem}>
          <Settings size={20} color={colors.primary} />
          <Text style={[
            styles.specLabel,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Transmission
          </Text>
          <Text style={[
            styles.specValue,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {car.specifications.transmission}
          </Text>
        </View>

        <View style={styles.specItem}>
          <Fuel size={20} color={colors.primary} />
          <Text style={[
            styles.specLabel,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Fuel Type
          </Text>
          <Text style={[
            styles.specValue,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {car.specifications.fuelType}
          </Text>
        </View>

        <View style={styles.specItem}>
          <Car size={20} color={colors.primary} />
          <Text style={[
            styles.specLabel,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Doors
          </Text>
          <Text style={[
            styles.specValue,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {car.specifications.doors}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
      {[
        { key: 'overview', label: 'Overview' },
        { key: 'features', label: 'Features' },
        { key: 'reviews', label: 'Reviews' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Text style={[
            styles.tabText,
            { 
              color: activeTab === tab.key ? colors.primary : colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
            <Text style={[
              styles.sectionTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
              }
            ]}>
              About this car
            </Text>
            <Text style={[
              styles.description,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              This well-maintained {car.make} {car.model} is perfect for your next trip. 
              The car is regularly serviced and kept in excellent condition. 
              Ideal for city driving and highway trips.
            </Text>

            <Text style={[
              styles.sectionTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
              }
            ]}>
              Rules & Policies
            </Text>
            
            <View style={styles.rulesContainer}>
              <View style={styles.ruleItem}>
                <CheckCircle 
                  size={16} 
                  color={car.rules.smoking ? colors.success : colors.error} 
                />
                <Text style={[
                  styles.ruleText,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  Smoking {car.rules.smoking ? 'allowed' : 'not allowed'}
                </Text>
              </View>
              
              <View style={styles.ruleItem}>
                <CheckCircle 
                  size={16} 
                  color={car.rules.pets ? colors.success : colors.error} 
                />
                <Text style={[
                  styles.ruleText,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  Pets {car.rules.pets ? 'allowed' : 'not allowed'}
                </Text>
              </View>
              
              <View style={styles.ruleItem}>
                <CheckCircle 
                  size={16} 
                  color={car.rules.additionalDrivers ? colors.success : colors.error} 
                />
                <Text style={[
                  styles.ruleText,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  Additional drivers {car.rules.additionalDrivers ? 'allowed' : 'not allowed'}
                </Text>
              </View>
              
              <View style={styles.ruleItem}>
                <Clock size={16} color={colors.primary} />
                <Text style={[
                  styles.ruleText,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  Minimum age: {car.rules.minimumAge} years
                </Text>
              </View>
            </View>
          </View>
        );
      
      case 'features':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
            <Text style={[
              styles.sectionTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
              }
            ]}>
              Features & Amenities
            </Text>
            
            <View style={styles.featuresGrid}>
              {car.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle size={16} color={colors.success} />
                  <Text style={[
                    styles.featureText,
                    { 
                      color: colors.text,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'reviews':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.card }]}>
            <View style={styles.reviewsHeader}>
              <Text style={[
                styles.sectionTitle,
                { 
                  color: colors.text,
                  fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
                }
              ]}>
                Reviews ({car.reviewCount})
              </Text>
              
              <View style={styles.overallRating}>
                <Star size={20} color={colors.accent} fill={colors.accent} />
                <Text style={[
                  styles.overallRatingText,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
                  }
                ]}>
                  {car.rating}
                </Text>
              </View>
            </View>
            
            {/* Mock reviews */}
            <View style={styles.reviewsList}>
              {[1, 2, 3].map((_, index) => (
                <View key={index} style={[styles.reviewItem, { borderBottomColor: colors.border }]}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ 
                        uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                      }}
                      style={styles.reviewerAvatar}
                    />
                    <View style={styles.reviewerInfo}>
                      <Text style={[
                        styles.reviewerName,
                        { 
                          color: colors.text,
                          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
                        }
                      ]}>
                        Ahmed Ali
                      </Text>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            color={colors.accent}
                            fill={star <= 5 ? colors.accent : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={[
                      styles.reviewDate,
                      { 
                        color: colors.textSecondary,
                        fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                      }
                    ]}>
                      2 days ago
                    </Text>
                  </View>
                  <Text style={[
                    styles.reviewText,
                    { 
                      color: colors.textSecondary,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}>
                    Great car! Very clean and comfortable. The owner was very responsive and helpful.
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderOwnerInfo = () => (
    <View style={[styles.ownerContainer, { backgroundColor: colors.card }]}>
      <Text style={[
        styles.sectionTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        About the Owner
      </Text>
      
      <View style={styles.ownerInfo}>
        <Image
          source={{ 
            uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }}
          style={styles.ownerAvatar}
        />
        <View style={styles.ownerDetails}>
          <Text style={[
            styles.ownerName,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            Mohammed Al-Rashid
          </Text>
          <View style={styles.ownerStats}>
            <View style={styles.ownerStat}>
              <Shield size={14} color={colors.success} />
              <Text style={[
                styles.ownerStatText,
                { 
                  color: colors.success,
                  fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                }
              ]}>
                Verified
              </Text>
            </View>
            <View style={styles.ownerStat}>
              <Star size={14} color={colors.accent} />
              <Text style={[
                styles.ownerStatText,
                { 
                  color: colors.text,
                  fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                }
              ]}>
                4.9 (127 reviews)
              </Text>
            </View>
          </View>
          <Text style={[
            styles.ownerJoined,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Joined in 2022
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.contactButton, { borderColor: colors.border }]}
        onPress={handleContact}
      >
        <MessageSquare size={20} color={colors.primary} />
        <Text style={[
          styles.contactButtonText,
          { 
            color: colors.primary,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          Contact Owner
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderBookingSection = () => (
    <View style={[styles.bookingContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.bookingInfo}>
        <Text style={[
          styles.bookingPrice,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {car.price} SAR
        </Text>
        <Text style={[
          styles.bookingUnit,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          per day
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: colors.primary }]}
        onPress={handleBooking}
      >
        <Text style={[
          styles.bookButtonText,
          { fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold' }
        ]}>
          {car.instantBooking ? 'Book Instantly' : 'Request Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        {renderCarInfo()}
        {renderSpecifications()}
        {renderTabs()}
        {renderTabContent()}
        {renderOwnerInfo()}
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {renderBookingSection()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  backToHomeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToHomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  imageGallery: {
    position: 'relative',
  },
  carImage: {
    width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  instantBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  instantBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  carInfoContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carTitleContainer: {
    flex: 1,
  },
  carTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carYear: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 16,
  },
  specificationsContainer: {
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    alignItems: 'center',
    width: (width - 72) / 4,
  },
  specLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabContent: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  rulesContainer: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleText: {
    fontSize: 14,
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewsList: {
    gap: 16,
  },
  reviewItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 18,
  },
  ownerContainer: {
    padding: 20,
    marginTop: 8,
  },
  ownerInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ownerStats: {
    gap: 4,
    marginBottom: 4,
  },
  ownerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerStatText: {
    fontSize: 12,
  },
  ownerJoined: {
    fontSize: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    gap: 16,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bookingPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookingUnit: {
    fontSize: 14,
  },
  bookButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});