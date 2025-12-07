import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { loadEvents, setSelectedDate } from '../../store/slices/eventsSlice';
import { Calendar } from '../../components/calendar/Calendar';
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

  const selectedDayEvents = events.filter(
    (event: Event) => event.date === selectedDate,
  );

  const eventDates: string[] = Array.from(
    new Set(events.map((e: Event) => e.date)),
  );

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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

          {selectedDayEvents.length > 0 ? (
            <View>
              {selectedDayEvents.map((item: Event) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.eventCard}
                  onPress={() =>
                    navigation.navigate('EditEvent', { eventId: item.id })
                  }
                >
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventTime}>
                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t('calendar.noEventsScheduled')}
              </Text>
            </View>
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
  eventCard: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventTitle: {
    ...theme.typography.body1,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  eventTime: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...theme.typography.body2,
    color: theme.colors.text.tertiary,
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
