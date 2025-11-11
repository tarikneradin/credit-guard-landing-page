import React from 'react';
import {View} from 'react-native';

import {VerificationSuccessContent} from '../../../screens/identity/VerificationSuccessScreen';
import {useAuthStore} from '../../../stores/authStore';

type VerificationSuccessStepProps = {
  onAccessDashboard: () => void;
};

export const VerificationSuccessStep: React.FC<VerificationSuccessStepProps> = ({
  onAccessDashboard,
}) => {
  const {setIdentityCompleted} = useAuthStore();

  const handleContinue = React.useCallback(() => {
    setIdentityCompleted(true);
    onAccessDashboard();
  }, [setIdentityCompleted, onAccessDashboard]);

  return (
    <View style={{flex: 1}}>
      <VerificationSuccessContent onContinue={handleContinue} showProgressBar={false} />
    </View>
  );
};
