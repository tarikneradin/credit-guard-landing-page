import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TabIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({name, focused, color, size = 24}) => {
  const getIconText = () => {
    switch (name) {
      case 'dashboard':
        return '📊';
      case 'reports':
        return '📋';
      case 'settings':
        return '⚙️';
      default:
        return '•';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, {color, fontSize: size}]}>{getIconText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
