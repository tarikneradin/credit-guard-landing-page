import React from 'react';
import {View, ViewStyle, ViewProps} from 'react-native';
import {Colors, Spacing} from '../../constants';
import {createStyles, createShadow} from '../../utils/styles';

interface CreditCardProps extends ViewProps {
  padding?: number;
  margin?: number;
  elevation?: number;
  children: React.ReactNode;
}

export const CreditCard: React.FC<CreditCardProps> = ({
  padding = Spacing.md,
  margin = 0,
  elevation = 2,
  children,
  style,
  ...props
}) => {
  const cardStyle = [
    styles.card,
    {
      padding,
      margin,
      ...createShadow(elevation),
    },
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = createStyles({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  } as ViewStyle,
});
