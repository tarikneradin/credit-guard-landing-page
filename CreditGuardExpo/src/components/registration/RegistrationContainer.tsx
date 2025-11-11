import React from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform, StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RegistrationProgressBar} from './RegistrationProgressBar';
import {Colors, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

type RegistrationContainerProps = {
  currentStep: number;
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showKeyboardAvoidingView?: boolean;
};

export const RegistrationContainer: React.FC<RegistrationContainerProps> = ({
  currentStep,
  children,
  containerStyle,
  contentStyle,
  showKeyboardAvoidingView = true,
}) => {
  const content = (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {/* Unified Container Box */}
      <View style={styles.unifiedBox}>
        {/* Progress Bar inside the box */}
        <View style={styles.progressSection}>
          <RegistrationProgressBar currentStep={currentStep} />
        </View>

        {/* Main Content */}
        {children}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, containerStyle]}>
      {showKeyboardAvoidingView ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  unifiedBox: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    padding: Spacing.lg,
    overflow: 'hidden',
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
});

export default RegistrationContainer;
