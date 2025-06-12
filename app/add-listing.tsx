import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Car,
  Fuel,
  Settings,
  Users,
  DollarSign,
  Calendar,
  Star,
  Check,
  X,
  Upload,
  Plus,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

type Step = 'details' | 'photos' | 'pricing' | 'location' | 'features' | 'rules' | 'review';

interface CarListing {
  make: string;
  model: string;
  year: string;
  color: string;
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: string;
  doors: string;
  mileageLimit: string;
  description: string;
  pricePerDay: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  location: string;
  latitude: string;
  longitude: string;
  images: string[];
  features: string[];
  rules: {
    smoking: boolean;
    pets: boolean;
    additionalDrivers: boolean;
    minimumAge: string;
  };
  instantBooking: boolean;
}

const AVAILABLE_FEATURES = [
  'Air Conditioning',
  'Bluetooth',
  'GPS Navigation',
  'Backup Camera',
  'USB Charger',
  'Leather Seats',
  'Sunroof',
  'Heated Seats',
  'Cooled Seats',
  'Premium Sound',
  'Wireless Charging',
  '4WD',
  'Cruise Control',
  'Parking Sensors',
];

const CAR_MAKES = [
  'Toyota', 'Lexus', 'Mercedes-Benz', 'BMW', 'Audi', 'Nissan', 'Hyundai',
  'Kia', 'Honda', 'Chevrolet', 'Ford', 'Range Rover', 'Porsche', 'Volkswagen'
];

export default function AddListingScreen() {
  const { t, isRTL } = useI18n();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [isLoading, setIsLoading] = useState(false);
  
  const [listing, setListing] = useState<CarListing>({
    make: '',
    model: '',
    year: '',
    color: '',
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: '5',
    doors: '4',
    mileageLimit: '300',
    description: '',
    pricePerDay: '',
    weeklyDiscount: '0',
    monthlyDiscount: '0',
    location: '',
    latitude: '',
    longitude: '',
    images: [],
    features: [],
    rules: {
      smoking: false,
      pets: false,
      additionalDrivers: true,
      minimumAge: '21',
    },
    instantBooking: false,
  });

  const steps: { key: Step; title: string; icon: any }[] = [
    { key: 'details', title: 'Car Details', icon: Car },
    { key: 'photos', title: 'Photos', icon: Camera },
    { key: 'pricing', title: 'Pricing', icon: DollarSign },
    { key: 'location', title: 'Location', icon: MapPin },
    { key: 'features', title: 'Features', icon: Star },
    { key: 'rules', title: 'Rules', icon: Settings },
    { key: 'review', title: 'Review', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Camera not available', 'Camera functionality is not available on web platform');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setListing(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri],
      }));
    }
  };

  const removeImage = (index: number) => {
    setListing(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleFeature = (feature: string) => {
    setListing(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would submit to Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'Your car listing has been submitted for review.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
      <Text style={[
        styles.progressText,
        { 
          color: colors.textSecondary,
          fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
        }
      ]}>
        Step {currentStepIndex + 1} of {steps.length}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.backgroundSecondary }]}
        onPress={handleBack}
      >
        <ArrowLeft size={20} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={[
          styles.headerTitle,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {steps[currentStepIndex].title}
        </Text>
        <Text style={[
          styles.headerSubtitle,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          Add New Listing
        </Text>
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Tell us about your car
      </Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Make</Text>
        <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={listing.make}
            onChangeText={(text) => setListing(prev => ({ ...prev, make: text }))}
            placeholder="Select make"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Model</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={listing.model}
          onChangeText={(text) => setListing(prev => ({ ...prev, model: text }))}
          placeholder="Enter model"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Year</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={listing.year}
            onChangeText={(text) => setListing(prev => ({ ...prev, year: text }))}
            placeholder="2020"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Color</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={listing.color}
            onChangeText={(text) => setListing(prev => ({ ...prev, color: text }))}
            placeholder="White"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Transmission</Text>
          <View style={styles.segmentedControl}>
            {['automatic', 'manual'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.segmentButton,
                  listing.transmission === type && { backgroundColor: colors.primary },
                  { borderColor: colors.border }
                ]}
                onPress={() => setListing(prev => ({ ...prev, transmission: type as any }))}
              >
                <Text style={[
                  styles.segmentText,
                  listing.transmission === type && { color: 'white' },
                  { color: listing.transmission === type ? 'white' : colors.text }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Fuel Type</Text>
          <View style={[styles.pickerContainer, { borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={listing.fuelType}
              onChangeText={(text) => setListing(prev => ({ ...prev, fuelType: text as any }))}
              placeholder="Petrol"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[styles.textArea, { borderColor: colors.border, color: colors.text }]}
          value={listing.description}
          onChangeText={(text) => setListing(prev => ({ ...prev, description: text }))}
          placeholder="Describe your car's condition, special features, etc."
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
    </View>
  );

  const renderPhotosStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Add photos of your car
      </Text>
      <Text style={[
        styles.stepSubtitle,
        { 
          color: colors.textSecondary,
          fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
        }
      ]}>
        High-quality photos help your listing stand out
      </Text>

      <View style={styles.photosGrid}>
        {listing.images.map((image, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: image }} style={styles.photo} />
            <TouchableOpacity
              style={[styles.removePhotoButton, { backgroundColor: colors.error }]}
              onPress={() => removeImage(index)}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
            {index === 0 && (
              <View style={[styles.mainPhotoBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.mainPhotoText}>Main</Text>
              </View>
            )}
          </View>
        ))}
        
        {listing.images.length < 8 && (
          <TouchableOpacity
            style={[styles.addPhotoButton, { borderColor: colors.border }]}
            onPress={pickImage}
          >
            <Plus size={32} color={colors.textSecondary} />
            <Text style={[
              styles.addPhotoText,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderPricingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Set your pricing
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Daily Rate (SAR)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={listing.pricePerDay}
          onChangeText={(text) => setListing(prev => ({ ...prev, pricePerDay: text }))}
          placeholder="200"
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Weekly Discount (%)</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={listing.weeklyDiscount}
            onChangeText={(text) => setListing(prev => ({ ...prev, weeklyDiscount: text }))}
            placeholder="10"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: colors.text }]}>Monthly Discount (%)</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={listing.monthlyDiscount}
            onChangeText={(text) => setListing(prev => ({ ...prev, monthlyDiscount: text }))}
            placeholder="20"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={[styles.instantBookingContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.instantBookingContent}>
          <Text style={[
            styles.instantBookingTitle,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            Instant Booking
          </Text>
          <Text style={[
            styles.instantBookingSubtitle,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            Allow guests to book instantly without approval
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.toggle,
            listing.instantBooking && { backgroundColor: colors.primary },
            { backgroundColor: listing.instantBooking ? colors.primary : colors.border }
          ]}
          onPress={() => setListing(prev => ({ ...prev, instantBooking: !prev.instantBooking }))}
        >
          <View style={[
            styles.toggleThumb,
            listing.instantBooking && styles.toggleThumbActive,
            { backgroundColor: colors.card }
          ]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Where is your car located?
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Address</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          value={listing.location}
          onChangeText={(text) => setListing(prev => ({ ...prev, location: text }))}
          placeholder="Enter pickup location"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <TouchableOpacity
        style={[styles.locationButton, { borderColor: colors.border }]}
        onPress={() => {
          // In a real app, this would open a map picker
          Alert.alert('Map Picker', 'Map picker would open here');
        }}
      >
        <MapPin size={20} color={colors.primary} />
        <Text style={[
          styles.locationButtonText,
          { 
            color: colors.primary,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          Use Current Location
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeaturesStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        What features does your car have?
      </Text>

      <View style={styles.featuresGrid}>
        {AVAILABLE_FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature}
            style={[
              styles.featureButton,
              listing.features.includes(feature) && { backgroundColor: colors.primaryLight },
              { borderColor: listing.features.includes(feature) ? colors.primary : colors.border }
            ]}
            onPress={() => toggleFeature(feature)}
          >
            <Text style={[
              styles.featureText,
              listing.features.includes(feature) && { color: colors.primary },
              { 
                color: listing.features.includes(feature) ? colors.primary : colors.text,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {feature}
            </Text>
            {listing.features.includes(feature) && (
              <Check size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRulesStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Set your rules and policies
      </Text>

      <View style={styles.rulesContainer}>
        <View style={styles.ruleItem}>
          <View style={styles.ruleContent}>
            <Text style={[
              styles.ruleTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
              }
            ]}>
              Smoking Allowed
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              listing.rules.smoking && { backgroundColor: colors.primary },
              { backgroundColor: listing.rules.smoking ? colors.primary : colors.border }
            ]}
            onPress={() => setListing(prev => ({
              ...prev,
              rules: { ...prev.rules, smoking: !prev.rules.smoking }
            }))}
          >
            <View style={[
              styles.toggleThumb,
              listing.rules.smoking && styles.toggleThumbActive,
              { backgroundColor: colors.card }
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.ruleContent}>
            <Text style={[
              styles.ruleTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
              }
            ]}>
              Pets Allowed
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              listing.rules.pets && { backgroundColor: colors.primary },
              { backgroundColor: listing.rules.pets ? colors.primary : colors.border }
            ]}
            onPress={() => setListing(prev => ({
              ...prev,
              rules: { ...prev.rules, pets: !prev.rules.pets }
            }))}
          >
            <View style={[
              styles.toggleThumb,
              listing.rules.pets && styles.toggleThumbActive,
              { backgroundColor: colors.card }
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.ruleItem}>
          <View style={styles.ruleContent}>
            <Text style={[
              styles.ruleTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
              }
            ]}>
              Additional Drivers
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              listing.rules.additionalDrivers && { backgroundColor: colors.primary },
              { backgroundColor: listing.rules.additionalDrivers ? colors.primary : colors.border }
            ]}
            onPress={() => setListing(prev => ({
              ...prev,
              rules: { ...prev.rules, additionalDrivers: !prev.rules.additionalDrivers }
            }))}
          >
            <View style={[
              styles.toggleThumb,
              listing.rules.additionalDrivers && styles.toggleThumbActive,
              { backgroundColor: colors.card }
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Minimum Age</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={listing.rules.minimumAge}
            onChangeText={(text) => setListing(prev => ({
              ...prev,
              rules: { ...prev.rules, minimumAge: text }
            }))}
            placeholder="21"
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContainer}>
      <Text style={[
        styles.stepTitle,
        { 
          color: colors.text,
          fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
        }
      ]}>
        Review your listing
      </Text>

      <ScrollView style={styles.reviewContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.reviewCard, { backgroundColor: colors.card }]}>
          {listing.images.length > 0 && (
            <Image source={{ uri: listing.images[0] }} style={styles.reviewImage} />
          )}
          
          <View style={styles.reviewContent}>
            <Text style={[
              styles.reviewTitle,
              { 
                color: colors.text,
                fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
              }
            ]}>
              {listing.make} {listing.model} {listing.year}
            </Text>
            
            <Text style={[
              styles.reviewPrice,
              { 
                color: colors.primary,
                fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
              }
            ]}>
              {listing.pricePerDay} SAR/day
            </Text>

            <Text style={[
              styles.reviewDescription,
              { 
                color: colors.textSecondary,
                fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
              }
            ]}>
              {listing.description}
            </Text>

            <View style={styles.reviewSpecs}>
              <Text style={[styles.reviewSpec, { color: colors.text }]}>
                {listing.transmission} • {listing.fuelType} • {listing.seats} seats
              </Text>
            </View>

            <View style={styles.reviewFeatures}>
              {listing.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={[styles.featureTag, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.featureTagText, { color: colors.text }]}>{feature}</Text>
                </View>
              ))}
              {listing.features.length > 3 && (
                <Text style={[styles.moreFeatures, { color: colors.textSecondary }]}>
                  +{listing.features.length - 3} more
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return renderDetailsStep();
      case 'photos':
        return renderPhotosStep();
      case 'pricing':
        return renderPricingStep();
      case 'location':
        return renderLocationStep();
      case 'features':
        return renderFeaturesStep();
      case 'rules':
        return renderRulesStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderDetailsStep();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'details':
        return listing.make && listing.model && listing.year && listing.color;
      case 'photos':
        return listing.images.length > 0;
      case 'pricing':
        return listing.pricePerDay;
      case 'location':
        return listing.location;
      case 'features':
        return true; // Optional
      case 'rules':
        return listing.rules.minimumAge;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderProgressBar()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isStepValid() && styles.nextButtonDisabled,
            { backgroundColor: isStepValid() ? colors.primary : colors.border }
          ]}
          onPress={currentStep === 'review' ? handleSubmit : handleNext}
          disabled={!isStepValid() || isLoading}
        >
          <Text style={[
            styles.nextButtonText,
            { 
              color: isStepValid() ? 'white' : colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            {isLoading ? 'Publishing...' : currentStep === 'review' ? 'Publish Listing' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoContainer: {
    width: (width - 56) / 2,
    aspectRatio: 16 / 9,
    margin: 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPhotoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mainPhotoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: (width - 56) / 2,
    aspectRatio: 16 / 9,
    margin: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 14,
    marginTop: 8,
  },
  instantBookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  instantBookingContent: {
    flex: 1,
  },
  instantBookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instantBookingSubtitle: {
    fontSize: 14,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 4,
  },
  featureText: {
    fontSize: 14,
    marginRight: 8,
  },
  rulesContainer: {
    marginTop: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  reviewContainer: {
    flex: 1,
  },
  reviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewImage: {
    width: '100%',
    height: 200,
  },
  reviewContent: {
    padding: 16,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reviewPrice: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  reviewDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  reviewSpecs: {
    marginBottom: 16,
  },
  reviewSpec: {
    fontSize: 14,
  },
  reviewFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreFeatures: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});