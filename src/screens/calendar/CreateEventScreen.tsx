import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, StatusBar } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/useAuth';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useFormValidation } from '../../hooks/useFormValidation';
import { createEvent, loadEvents } from '../../store/slices/eventsSlice';
import { Header, Button } from '../../components/common';
import { EventForm } from '../../components/calendar/EventForm';
import { t } from '../../i18n';
import { theme } from '../../theme';

const CreateEventScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { loading, execute } = useAsyncAction();
  const { validateRequiredField } = useFormValidation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const handleCreate = async () => {
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
      },
      {
        successMessage: t('success.eventCreated'),
        errorMessage: t('errors.createEventFailed'),
        onSuccess: () => navigation.goBack(),
      },
    );
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
  buttonContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.huge,
  },
});

export default CreateEventScreen;
