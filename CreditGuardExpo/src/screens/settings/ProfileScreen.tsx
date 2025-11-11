import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';
import {useUserProfileStore} from '../../stores/userProfileStore';

export const ProfileScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {profile, isLoading, fetchProfile, updateProfile} = useUserProfileStore();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setPhone(profile.phone);
      setStreet(profile.address?.street || '');
      setCity(profile.address?.city || '');
      setState(profile.address?.state || '');
      setZipCode(profile.address?.zipCode || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        address: {street, city, state, zipCode},
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (_error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setEmail(profile.email);
      setPhone(profile.phone);
      setStreet(profile.address?.street || '');
      setCity(profile.address?.city || '');
      setState(profile.address?.state || '');
      setZipCode(profile.address?.zipCode || '');
    }
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality will be available soon.',
      [{text: 'OK'}]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert(
      'Upload Photo',
      'Photo upload functionality will be available soon.',
      [{text: 'OK'}]
    );
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
        <HeaderWithOptions
          title="Profile"
          onBackPress={() => navigation.goBack()}
          showBackButton
        />
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions
        title="Profile"
        onBackPress={() => navigation.goBack()}
        showBackButton
        rightComponent={
          !isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles(theme).editButton}>Edit</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles(theme).profilePictureSection}>
          <View style={styles(theme).profilePicturePlaceholder}>
            <Ionicons name="person" size={60} color={theme.colors.textSecondary} />
          </View>
          <TouchableOpacity
            style={styles(theme).uploadPhotoButton}
            onPress={handleUploadPhoto}>
            <Ionicons name="camera" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Personal Information</Text>

          <View style={styles(theme).formCard}>
            <View style={styles(theme).inputGroup}>
              <Text style={styles(theme).label}>First Name</Text>
              <TextInput
                style={[
                  styles(theme).input,
                  !isEditing && styles(theme).inputDisabled,
                ]}
                value={firstName}
                onChangeText={setFirstName}
                editable={isEditing}
                placeholder="Enter your first name"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={[styles(theme).inputGroup, styles(theme).inputGroupBorder]}>
              <Text style={styles(theme).label}>Last Name</Text>
              <TextInput
                style={[
                  styles(theme).input,
                  !isEditing && styles(theme).inputDisabled,
                ]}
                value={lastName}
                onChangeText={setLastName}
                editable={isEditing}
                placeholder="Enter your last name"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={[styles(theme).inputGroup, styles(theme).inputGroupBorder]}>
              <Text style={styles(theme).label}>Email</Text>
              <View style={styles(theme).inputRow}>
                <TextInput
                  style={[
                    styles(theme).input,
                    !isEditing && styles(theme).inputDisabled,
                    {flex: 1, marginBottom: 0},
                  ]}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {profile?.isEmailVerified && (
                  <View style={styles(theme).verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles(theme).verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles(theme).inputGroup, styles(theme).inputGroupBorder]}>
              <Text style={styles(theme).label}>Phone</Text>
              <View style={styles(theme).inputRow}>
                <TextInput
                  style={[
                    styles(theme).input,
                    !isEditing && styles(theme).inputDisabled,
                    {flex: 1, marginBottom: 0},
                  ]}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  placeholder="Enter your phone number"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="phone-pad"
                />
                {profile?.isPhoneVerified && (
                  <View style={styles(theme).verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles(theme).verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Address</Text>

          <View style={styles(theme).formCard}>
            <View style={styles(theme).inputGroup}>
              <Text style={styles(theme).label}>Street Address</Text>
              <TextInput
                style={[
                  styles(theme).input,
                  !isEditing && styles(theme).inputDisabled,
                ]}
                value={street}
                onChangeText={setStreet}
                editable={isEditing}
                placeholder="Enter your street address"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={[styles(theme).inputGroup, styles(theme).inputGroupBorder]}>
              <Text style={styles(theme).label}>City</Text>
              <TextInput
                style={[
                  styles(theme).input,
                  !isEditing && styles(theme).inputDisabled,
                ]}
                value={city}
                onChangeText={setCity}
                editable={isEditing}
                placeholder="Enter your city"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={[styles(theme).addressRow, styles(theme).inputGroupBorder]}>
              <View style={[styles(theme).inputGroup, {flex: 1, marginBottom: 0}]}>
                <Text style={styles(theme).label}>State</Text>
                <TextInput
                  style={[
                    styles(theme).input,
                    !isEditing && styles(theme).inputDisabled,
                  ]}
                  value={state}
                  onChangeText={setState}
                  editable={isEditing}
                  placeholder="ST"
                  placeholderTextColor={theme.colors.text.tertiary}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>

              <View style={[styles(theme).inputGroup, {flex: 1, marginLeft: 12, marginBottom: 0}]}>
                <Text style={styles(theme).label}>ZIP Code</Text>
                <TextInput
                  style={[
                    styles(theme).input,
                    !isEditing && styles(theme).inputDisabled,
                  ]}
                  value={zipCode}
                  onChangeText={setZipCode}
                  editable={isEditing}
                  placeholder="12345"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Security Actions */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Security</Text>

          <TouchableOpacity style={styles(theme).actionButton} onPress={handleChangePassword}>
            <View style={styles(theme).actionButtonContent}>
              <View style={styles(theme).actionIconContainer}>
                <Ionicons name="lock-closed-outline" size={22} color={theme.colors.accent} />
              </View>
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Change Password</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  Update your account password
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        {profile && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Account Information</Text>
            <View style={styles(theme).infoCard}>
              <View style={styles(theme).infoRow}>
                <Text style={styles(theme).infoLabel}>Member Since</Text>
                <Text style={styles(theme).infoValue}>
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={[styles(theme).infoRow, {borderBottomWidth: 0}]}>
                <Text style={styles(theme).infoLabel}>User ID</Text>
                <Text style={styles(theme).infoValue}>{profile.id}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <View style={styles(theme).actionButtonsContainer}>
            <TouchableOpacity
              style={[styles(theme).saveButton, isLoading && styles(theme).saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                  <Text style={styles(theme).saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles(theme).cancelButton}
              onPress={handleCancel}
              disabled={isLoading}>
              <Ionicons name="close-circle" size={20} color={theme.colors.text.primary} />
              <Text style={styles(theme).cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    editButton: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.accent,
      paddingHorizontal: 16,
    },
    profilePictureSection: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    profilePicturePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.card + '40',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.accent + '20',
    },
    uploadPhotoButton: {
      position: 'absolute',
      bottom: 24,
      right: '50%',
      marginRight: -72,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.colors.background,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    formCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputGroupBorder: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressRow: {
      flexDirection: 'row',
      paddingTop: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    input: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      padding: 0,
      fontSize: 16,
      color: theme.colors.text.primary,
      borderWidth: 0,
      marginBottom: 0,
    },
    inputDisabled: {
      color: theme.colors.text.secondary,
      opacity: 0.8,
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.success + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginLeft: 8,
    },
    verifiedText: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.success,
      marginLeft: 4,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionButtonText: {
      marginLeft: 16,
      flex: 1,
    },
    actionButtonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    actionButtonSubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    actionButtonsContainer: {
      paddingHorizontal: 20,
      marginTop: 8,
    },
    saveButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent,
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      gap: 8,
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.white,
    },
    cancelButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.medium,
      gap: 8,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
  });
