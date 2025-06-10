import { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Animated
} from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const onboardingData = [
  {
    key: '1',
    title: 'onboarding.title1',
    subtitle: 'onboarding.subtitle1',
    image: 'https://images.pexels.com/photos/8075795/pexels-photo-8075795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Person getting car keys
  },
  {
    key: '2',
    title: 'onboarding.title2',
    subtitle: 'onboarding.subtitle2',
    image: 'https://images.pexels.com/photos/7148439/pexels-photo-7148439.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Person listing car on phone
  },
  {
    key: '3',
    title: 'onboarding.title3',
    subtitle: 'onboarding.subtitle3',
    image: 'https://images.pexels.com/photos/11194869/pexels-photo-11194869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Handshake/verification
  },
];

export default function Onboarding() {
  const { t, isRTL } = useI18n();
  const { width, height } = useWindowDimensions();
  const { user, isInitialized } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMountedRef = useRef(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    isMountedRef.current = true;
    
    // If user is already authenticated, go to main app
    if (isInitialized && user) {
      router.replace('/(tabs)');
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isInitialized, user]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0 && isMountedRef.current) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = () => {
    // If we're on the last slide, go to language selection
    if (currentIndex === onboardingData.length - 1) {
      router.push('/(onboarding)/language');
    } else {
      // Otherwise, go to the next slide
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/language');
  };

  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <Image
          source={{ uri: item.image }}
          style={[styles.image, { width, height: height * 0.6 }]}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', colorScheme === 'dark' ? '#111827' : '#FFFFFF']}
          style={[styles.gradient, { width, height: height * 0.4 }]}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text, fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold' }]}>
            {t(item.title)}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular' }]}>
            {t(item.subtitle)}
          </Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp'
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp'
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { 
                    width: dotWidth,
                    opacity,
                    backgroundColor: colors.primary
                  }
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={handleSkip}
      >
        <Text style={[
          styles.skipText, 
          { 
            color: colors.primary,
            fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
          }
        ]}>
          {t('onboarding.skip')}
        </Text>
      </TouchableOpacity>
      
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />
      
      {renderPagination()}
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[
            styles.nextButtonText, 
            { 
              color: 'white',
              fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
            }
          ]}>
            {currentIndex === onboardingData.length - 1 
              ? t('onboarding.getStarted') 
              : t('common.next')}
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});