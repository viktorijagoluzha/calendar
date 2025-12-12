import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { t } from '../../i18n';
import { theme } from '../../theme';
import { TIME_PLACEHOLDERS, TIME_SEPARATOR, LOCALE } from '../../constants';

interface EventFormProps {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  editable?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  title,
  description,
  date,
  startTime,
  endTime,
  onTitleChange,
  onDescriptionChange,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  editable = true,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = useCallback(
    (event: any, selectedDate?: Date) => {
      setShowDatePicker(Platform.OS === 'ios');
      if (selectedDate) {
        onDateChange(selectedDate);
      }
    },
    [onDateChange],
  );

  const handleShowDatePicker = useCallback(() => {
    if (editable) {
      setShowDatePicker(true);
    }
  }, [editable]);

  const formattedDate = useMemo(
    () =>
      date.toLocaleDateString(LOCALE.DEFAULT, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [date],
  );

  return (
    <>
      <View style={styles.titleSection}>
        <TextInput
          style={styles.titleInput}
          placeholder={t('calendar.eventTitle')}
          value={title}
          onChangeText={onTitleChange}
          placeholderTextColor={theme.colors.text.tertiary}
          editable={editable}
          accessibilityLabel={t('calendar.eventTitle')}
        />
      </View>

      <View style={styles.dateTimeSection}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={handleShowDatePicker}
          disabled={!editable}
          accessibilityRole="button"
          accessibilityLabel={`${t('calendar.date')}: ${formattedDate}`}
          accessibilityHint={editable ? 'Tap to change date' : undefined}
        >
          <Text style={styles.dateTimeText}>{formattedDate}</Text>
        </TouchableOpacity>

        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            placeholder={TIME_PLACEHOLDERS.START}
            value={startTime}
            onChangeText={onStartTimeChange}
            placeholderTextColor={theme.colors.text.tertiary}
            editable={editable}
            accessibilityLabel={t('calendar.startTime')}
          />
          <Text style={styles.timeSeparator}>{TIME_SEPARATOR}</Text>
          <TextInput
            style={styles.timeInput}
            placeholder={TIME_PLACEHOLDERS.END}
            value={endTime}
            onChangeText={onEndTimeChange}
            placeholderTextColor={theme.colors.text.tertiary}
            editable={editable}
            accessibilityLabel={t('calendar.endTime')}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionLabel}>{t('calendar.description')}</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder={t('calendar.enterDescription')}
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor={theme.colors.text.tertiary}
          editable={editable}
          accessibilityLabel={t('calendar.description')}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleSection: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleInput: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    padding: 0,
  },
  dateTimeSection: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateTimeButton: {
    marginBottom: theme.spacing.sm,
  },
  dateTimeText: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    padding: 0,
  },
  timeSeparator: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    marginHorizontal: theme.spacing.xs,
  },
  descriptionSection: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  sectionLabel: {
    ...theme.typography.label,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  descriptionInput: {
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
