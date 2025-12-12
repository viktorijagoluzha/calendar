import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Event } from '../../types/Event';
import { formatTimeRange } from '../../utils/timeFormat';
import { t } from '../../i18n';
import { theme } from '../../theme';

interface EventListProps {
  events: Event[];
  onEventPress: (eventId: string) => void;
}

interface EventCardProps {
  event: Event;
  onPress: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = React.memo(({ event, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(event.id);
  }, [event.id, onPress]);

  const timeRange = useMemo(
    () => formatTimeRange(event.startTime, event.endTime),
    [event.startTime, event.endTime],
  );

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${timeRange}`}
      accessibilityHint={t('calendar.tapToViewDetails')}
    >
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventTime}>{timeRange}</Text>
      {event.description ? (
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
});

EventCard.displayName = 'EventCard';

export const EventList: React.FC<EventListProps> = ({
  events,
  onEventPress,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: Event }) => (
      <EventCard event={item} onPress={onEventPress} />
    ),
    [onEventPress],
  );

  const keyExtractor = useCallback((item: Event) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          {t('calendar.noEventsScheduled')}
        </Text>
      </View>
    ),
    [],
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={
        events.length === 0 ? undefined : styles.listContent
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: theme.spacing.sm,
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
