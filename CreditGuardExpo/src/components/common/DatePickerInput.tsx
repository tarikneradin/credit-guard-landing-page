import React, {useMemo, useState} from 'react';
import {Modal, Platform, Pressable, StyleSheet, Text, View, AccessibilityRole} from 'react-native';
import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import {CreditButton, CreditInput} from '../design-system';
import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

type BaseDateTimeProps = Partial<AndroidNativeProps & IOSNativeProps>;

interface DatePickerInputProps extends Pick<BaseDateTimeProps, 'minimumDate' | 'maximumDate'> {
  label: string;
  value?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  placeholder?: string;
  onChange: (formattedDate: string) => void;
  onOpen?: () => void;
  onConfirm?: (formattedDate: string) => void;
  accessibilityRole?: AccessibilityRole;
}

const formatDate = (date: Date): string => {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const year = `${date.getFullYear()}`;
  return `${month}/${day}/${year}`;
};

const parseDate = (value: string): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const [month, day, year] = value.split('/');
  if (!month || !day || !year) {
    return undefined;
  }

  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  required,
  helperText,
  error,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  onChange,
  onOpen,
  onConfirm,
  accessibilityRole,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const pressableRole: AccessibilityRole = accessibilityRole ?? 'button';

  const initialDate = useMemo(() => parseDate(value ?? '') ?? new Date(), [value]);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  React.useEffect(() => {
    setSelectedDate(parseDate(value ?? '') ?? new Date());
  }, [value]);

  const openPicker = () => {
    onOpen?.();
    setIsVisible(true);
  };

  const closePicker = () => {
    setIsVisible(false);
  };

  const handleConfirm = () => {
    const formatted = formatDate(selectedDate);
    onChange(formatted);
    onConfirm?.(formatted);
    closePicker();
  };

  const handleDateChange: BaseDateTimeProps['onChange'] = (_, date) => {
    if (date) {
      setSelectedDate(date);
      if (Platform.OS === 'android') {
        const formatted = formatDate(date);
        onChange(formatted);
        onConfirm?.(formatted);
        closePicker();
      }
    } else if (Platform.OS === 'android') {
      closePicker();
    }
  };

  return (
    <>
      <Pressable accessibilityRole={pressableRole} onPress={openPicker}>
        <CreditInput
          label={label}
          value={value || ''}
          placeholder={placeholder}
          required={required}
          helperText={helperText}
          error={error}
          editable={false}
          pointerEvents="none"
        />
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={closePicker}
        supportedOrientations={['portrait', 'landscape']}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={closePicker} />
          <View style={styles.modalContainer} pointerEvents="box-none">
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{label}</Text>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleDateChange}
              />
              {Platform.OS === 'ios' && (
                <CreditButton
                  title="Confirm"
                  onPress={handleConfirm}
                  style={styles.confirmButton}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = createStyles({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.headline4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  confirmButton: {
    marginTop: Spacing.lg,
  },
});
