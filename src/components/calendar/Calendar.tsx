import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { DAYS, MONTHS } from '../../constants';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  eventDates?: string[];
}

const formatDateString = (year: number, month: number, day: number): string => {
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  eventDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }, []);

  const handleDayPress = useCallback(
    (day: number) => {
      const newDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      onDateSelect(newDate);
    },
    [currentMonth, onDateSelect],
  );

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDate; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth]);

  const today = useMemo(() => new Date(), []);

  const monthYear = useMemo(
    () => `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`,
    [currentMonth],
  );

  const eventDatesSet = useMemo(() => new Set(eventDates), [eventDates]);

  const isSelected = useCallback(
    (day: number): boolean => {
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear()
      );
    },
    [selectedDate, currentMonth],
  );

  const isToday = useCallback(
    (day: number): boolean => {
      return (
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear()
      );
    },
    [today, currentMonth],
  );

  const hasEvent = useCallback(
    (day: number): boolean => {
      const dateStr = formatDateString(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      return eventDatesSet.has(dateStr);
    },
    [currentMonth, eventDatesSet],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText} accessibilityRole="header">
          {monthYear}
        </Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {DAYS.map(day => (
          <View key={day} style={styles.dayLabel}>
            <Text style={styles.dayLabelText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {daysInMonth.map((day, index) => (
          <View key={index} style={styles.dayCell}>
            {day !== null ? (
              <TouchableOpacity
                onPress={() => handleDayPress(day)}
                style={[
                  styles.dayButton,
                  isSelected(day) && styles.selectedDay,
                  isToday(day) && !isSelected(day) && styles.todayDay,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${MONTHS[currentMonth.getMonth()]} ${day}`}
                accessibilityState={{ selected: isSelected(day) }}
                accessibilityHint={hasEvent(day) ? 'Has events' : undefined}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected(day) && styles.selectedDayText,
                    isToday(day) && !isSelected(day) && styles.todayDayText,
                  ]}
                >
                  {day}
                </Text>
                {hasEvent(day) && <View style={styles.eventDot} />}
              </TouchableOpacity>
            ) : (
              <View style={styles.emptyDay} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  navButton: {
    padding: theme.spacing.sm,
  },
  navButtonText: {
    ...theme.typography.h4,
  },
  monthText: {
    ...theme.typography.body1,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  dayLabel: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabelText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: theme.spacing.xs,
  },
  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    position: 'relative',
  },
  emptyDay: {
    flex: 1,
  },
  dayText: {
    ...theme.typography.body2,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
  },
  selectedDayText: {
    color: theme.colors.text.inverse,
    fontWeight: '600',
  },
  todayDay: {
    backgroundColor: theme.colors.primaryLight,
  },
  todayDayText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: theme.spacing.xs,
    width: theme.spacing.xs,
    height: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.secondary,
  },
});
