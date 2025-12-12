import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { loadEvents, setSelectedDate } from '../../store/slices/eventsSlice';
import { Calendar, EventList } from '../../components/calendar';
import { Event } from '../../types/Event';
import { t } from '../../i18n';
import { theme } from '../../theme';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { events, selectedDate, isLoading } = useAppSelector(
    state => state.events,
  );

  const [selectedDateObj, setSelectedDateObj] = useState(new Date());

  useEffect(() => {
    if (user) {
      dispatch(loadEvents(user.id));
    }
  }, [user]);

  const handleDateSelect = (date: Date) => {
    setSelectedDateObj(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    dispatch(setSelectedDate(dateString));
  };

  const selectedDayEvents = useMemo(
    () => events.filter((event: Event) => event.date === selectedDate),
    [events, selectedDate],
  );

  const eventDates = useMemo(
    () => Array.from(new Set(events.map((e: Event) => e.date))),
    [events],
  );

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EditEvent', { eventId });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>{t('calendar.calendar')}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.calendarContainer}>
          <Calendar
            selectedDate={selectedDateObj}
            onDateSelect={handleDateSelect}
            eventDates={eventDates}
          />
        </View>

        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>{t('calendar.todaysEvents')}</Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <EventList
              events={selectedDayEvents}
              onEventPress={handleEventPress}
            />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Icon name="add" size={32} color={theme.colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  blueHeader: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.inverse,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  calendarContainer: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  eventsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.massive,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});

export default HomeScreen;
