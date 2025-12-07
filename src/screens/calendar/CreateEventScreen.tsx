import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/useAuth';
import { createEvent, loadEvents } from '../../store/slices/eventsSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Header, Button } from '../../components/common';
import { t } from '../../i18n';
import { theme } from '../../theme';

const CreateEventScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert(t('common.error'), t('errors.enterEventTitle'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('errors.userNotFound'));
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        createEvent({
          userId: user.id,
          eventData: {
            title,
            description,
            date,
            startTime,
            endTime,
          },
        }),
      ).unwrap();

      await dispatch(loadEvents(user.id));

      Alert.alert(t('common.success'), t('success.eventCreated'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('errors.createEventFailed'),
      );
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <Header
        title={t('calendar.createEvent')}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <TextInput
            style={styles.titleInput}
            placeholder={t('calendar.eventTitle')}
            value={title}
            onChangeText={setTitle}
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
              onChangeText={setStartTime}
              placeholderTextColor={theme.colors.text.tertiary}
            />
            <Text style={styles.timeSeparator}>-</Text>
            <TextInput
              style={styles.timeInput}
              placeholder="11:30 AM"
              value={endTime}
              onChangeText={setEndTime}
              placeholderTextColor={theme.colors.text.tertiary}
            />
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionLabel}>{t('calendar.description')}</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder={t('calendar.enterDescription')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={t('common.save')}
            onPress={handleCreate}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
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
  buttonContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: 40,
  },
});

export default CreateEventScreen;
