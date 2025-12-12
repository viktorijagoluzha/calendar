import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  updateEvent,
  deleteEvent,
  loadEvents,
} from '../../store/slices/eventsSlice';
import { Header, Button } from '../../components/common';
import { EventForm } from '../../components/calendar/EventForm';
import { t } from '../../i18n';
import { theme } from '../../theme';

const EditEventScreen = ({ navigation, route }: any) => {
  const { eventId } = route.params;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const events = useAppSelector(state => state.events.events);
  const { loading, execute } = useAsyncAction();
  const { validateRequiredField } = useFormValidation();

  const event = events.find((e: any) => e.id === eventId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

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
    if (!validateRequiredField(title, t('errors.enterEventTitle'))) {
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('errors.userNotFound'));
      return;
    }

    await execute(
      async () => {
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
      },
      {
        successMessage: t('success.eventUpdated'),
        errorMessage: t('errors.updateEventFailed'),
        onSuccess: () => navigation.goBack(),
      },
    );
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
            await execute(
              async () => {
                await dispatch(
                  deleteEvent({ userId: user.id, eventId }),
                ).unwrap();
                await dispatch(loadEvents(user.id));
              },
              {
                errorMessage: t('errors.deleteEventFailed'),
                onSuccess: () => navigation.goBack(),
              },
            );
          },
        },
      ],
    );
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
        />
        <Header
          title={t('calendar.editEvent')}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <Text>{t('errors.eventNotFound')}</Text>
        </View>
      </View>
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
        <EventForm
          title={title}
          description={description}
          date={date}
          startTime={startTime}
          endTime={endTime}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onDateChange={setDate}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />

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
