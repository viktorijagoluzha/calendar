import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  eventDates?: string[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  eventDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

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

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const handleDayPress = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    onDateSelect(newDate);
  };

  const isSelected = (day: number): boolean => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const hasEvent = (day: number): boolean => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    return eventDates.includes(dateStr);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
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
