import React, { useState, useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import {
  updateEvent,
  deleteEvent,
  loadEvents,
} from '../../store/slices/eventsSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Header, Button } from '../../components/common';
import { t } from '../../i18n';
import { theme } from '../../theme';

const EditEventScreen = ({ navigation, route }: any) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const events = useAppSelector(state => state.events.events);

  const event = events.find((e: any) => e.id === eventId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      const [year, month, day] = event.date.split('-').map(Number);
      setDate(new Date(year, month - 1, day));
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    }
  }, [event]);

  const handleUpdate = async () => {
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
        updateEvent({
          userId: user.id,
          eventId,
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

      Alert.alert(t('common.success'), t('success.eventUpdated'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(
        t('common.error'),
        error.message || t('errors.updateEventFailed'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('confirmations.deleteEvent'),
      t('confirmations.deleteEventMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await dispatch(
                deleteEvent({ userId: user.id, eventId }),
              ).unwrap();
              await dispatch(loadEvents(user.id));
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                t('common.error'),
                error.message || t('errors.deleteEventFailed'),
              );
            }
          },
        },
      ],
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text>{t('errors.eventNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <Header
        title={t('calendar.editEvent')}
        onBackPress={() => navigation.goBack()}
        rightIcon="trash-outline"
        onRightPress={handleDelete}
      />

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <TextInput
            style={styles.titleInput}
            placeholder="Meeting"
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
            onPress={handleUpdate}
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
    marginBottom: theme.spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditEventScreen;
