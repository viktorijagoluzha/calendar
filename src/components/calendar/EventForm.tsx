import React, { useState } from 'react';
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
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <>
      <View style={styles.titleSection}>
        <TextInput
          style={styles.titleInput}
          placeholder={t('calendar.eventTitle')}
          value={title}
          onChangeText={onTitleChange}
          placeholderTextColor={theme.colors.text.tertiary}
        />
      </View>

      <View style={styles.dateTimeSection}>
        <TouchableOpacity
          style={styles.dateTimeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateTimeText}>
            {date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        <View style={styles.timeRow}>
          <TextInput
            style={styles.timeInput}
            placeholder="10:30 AM"
            value={startTime}
            onChangeText={onStartTimeChange}
            placeholderTextColor={theme.colors.text.tertiary}
          />
          <Text style={styles.timeSeparator}>-</Text>
          <TextInput
            style={styles.timeInput}
            placeholder="11:30 AM"
            value={endTime}
            onChangeText={onEndTimeChange}
            placeholderTextColor={theme.colors.text.tertiary}
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
