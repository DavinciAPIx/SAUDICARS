import { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ChevronLeft, Camera, Image as ImageIcon, CircleCheck as CheckCircle } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function ScanLicenseScreen() {
  const { t, isRTL } = useI18n();
  const { uploadDriverLicense, isLoading } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setLicenseImage(photo.uri);
      setIsCameraVisible(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setLicenseImage(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (licenseImage) {
      const success = await uploadDriverLicense(licenseImage);
      if (success) {
        router.replace('/(tabs)');
      }
    }
  };

  // Handle camera permissions
  const showCamera = async () => {
    if (!permission?.granted) {
      const newPermission = await requestPermission();
      if (newPermission.granted) {
        setIsCameraVisible(true);
      }
    } else {
      setIsCameraVisible(true);
    }
  };

  if (isCameraVisible) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={() => setIsCameraVisible(false)}
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, { borderColor: '#FFFFFF' }]}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
              <Camera size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.licenseScanOverlay}>
            <View style={styles.scannerCorner} />
            <View style={[styles.scannerCorner, styles.topRight]} />
            <View style={[styles.scannerCorner, styles.bottomLeft]} />
            <View style={[styles.scannerCorner, styles.bottomRight]} />
          </View>
          
          <View style={styles.cameraInstructions}>
            <Text style={styles.cameraInstructionsText}>
              Position your driver's license within the frame
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {t('auth.driverLicense')}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={[
          styles.subtitle,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          Please upload a clear photo of your driver's license
        </Text>

        {licenseImage ? (
          <View style={styles.uploadedContainer}>
            <Image
              source={{ uri: licenseImage }}
              style={styles.licenseImage}
              resizeMode="cover"
            />
            <View style={styles.uploadedStatus}>
              <CheckCircle size={24} color={colors.success} />
              <Text style={[
                styles.uploadedText,
                { 
                  color: colors.success,
                  fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                }
              ]}>
                {t('auth.licenseUploaded')}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.retakeButton,
                { backgroundColor: colors.backgroundSecondary }
              ]}
              onPress={() => setLicenseImage(null)}
            >
              <Text style={[
                styles.retakeButtonText,
                { 
                  color: colors.primary,
                  fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                }
              ]}>
                Retake Photo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <TouchableOpacity
              style={[
                styles.uploadOption,
                { backgroundColor: colors.card }
              ]}
              onPress={showCamera}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.primaryLight }]}>
                <Camera size={24} color={colors.primary} />
              </View>
              <Text style={[
                styles.optionText,
                { 
                  color: colors.text,
                  fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                }
              ]}>
                {t('auth.takePicture')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.uploadOption,
                { backgroundColor: colors.card }
              ]}
              onPress={pickImage}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.secondaryLight }]}>
                <ImageIcon size={24} color={colors.secondary} />
              </View>
              <Text style={[
                styles.optionText,
                { 
                  color: colors.text,
                  fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                }
              ]}>
                {t('auth.uploadFromGallery')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: colors.primary },
            (!licenseImage || isLoading) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!licenseImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={[
              styles.continueButtonText,
              { fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold' }
            ]}>
              {t('common.next')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 300,
  },
  uploadOptions: {
    width: '100%',
    marginBottom: 40,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  uploadedContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  licenseImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  uploadedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadedText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  retakeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 400,
  },
  disabledButton: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Camera styles
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
  },
  licenseScanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerCorner: {
    position: 'absolute',
    top: 100,
    left: 80,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  topRight: {
    left: undefined,
    right: 80,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    top: undefined,
    bottom: 100,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: 100,
    right: 80,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  cameraInstructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cameraInstructionsText: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
  },
});