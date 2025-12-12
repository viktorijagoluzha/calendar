import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../types/Event';
import { formatTimeRange } from '../../utils/timeFormat';
import { t } from '../../i18n';
import { theme } from '../../theme';

interface EventListProps {
  events: Event[];
  onEventPress: (eventId: string) => void;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventPress,
}) => {
  if (events.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {t('calendar.noEventsScheduled')}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {events.map(event => (
        <TouchableOpacity
          key={event.id}
          style={styles.eventCard}
          onPress={() => onEventPress(event.id)}
        >
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>
            {formatTimeRange(event.startTime, event.endTime)}
          </Text>
          {event.description ? (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {event.description}
            </Text>
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
  eventDescription: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  emptyState: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...theme.typography.body2,
    color: theme.colors.text.tertiary,
  },
});
