import { eventService } from '../src/services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Event Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return empty array when no events exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const events = await eventService.getEvents('user123');

      expect(events).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        '@calendar_events_user123',
      );
    });

    it('should return parsed events when they exist', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Test Event',
          description: 'Test Description',
          date: '2025-12-06',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-06T00:00:00.000Z',
          updatedAt: '2025-12-06T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockEvents),
      );

      const events = await eventService.getEvents('user123');

      expect(events).toEqual(mockEvents);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const eventData = {
        title: 'New Event',
        description: 'Event Description',
        date: new Date('2025-12-06'),
        startTime: '14:00',
        endTime: '15:00',
      };

      const newEvent = await eventService.createEvent('user123', eventData);

      expect(newEvent.title).toBe('New Event');
      expect(newEvent.description).toBe('Event Description');
      expect(newEvent.startTime).toBe('14:00');
      expect(newEvent.endTime).toBe('15:00');
      expect(newEvent.userId).toBe('user123');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const existingEvents = [
        {
          id: '1',
          title: 'Old Title',
          description: 'Old Description',
          date: '2025-12-06',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-06T00:00:00.000Z',
          updatedAt: '2025-12-06T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEvents),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const updatedData = {
        title: 'Updated Title',
        description: 'Updated Description',
        date: new Date('2025-12-07'),
        startTime: '11:00',
        endTime: '12:00',
      };

      const updatedEvent = await eventService.updateEvent(
        'user123',
        '1',
        updatedData,
      );

      expect(updatedEvent.title).toBe('Updated Title');
      expect(updatedEvent.description).toBe('Updated Description');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should throw error when event not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const updatedData = {
        title: 'Updated Title',
        description: 'Updated Description',
        date: new Date('2025-12-07'),
        startTime: '11:00',
        endTime: '12:00',
      };

      await expect(
        eventService.updateEvent('user123', 'nonexistent', updatedData),
      ).rejects.toThrow('Event not found');
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const existingEvents = [
        {
          id: '1',
          title: 'Event 1',
          description: '',
          date: '2025-12-06',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-06T00:00:00.000Z',
          updatedAt: '2025-12-06T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Event 2',
          description: '',
          date: '2025-12-07',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-07T00:00:00.000Z',
          updatedAt: '2025-12-07T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingEvents),
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await eventService.deleteEvent('user123', '1');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@calendar_events_user123',
        expect.not.stringContaining('"id":"1"'),
      );
    });
  });

  describe('getEventsByDate', () => {
    it('should return only events for the specified date', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Event Today',
          description: '',
          date: '2025-12-06',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-06T00:00:00.000Z',
          updatedAt: '2025-12-06T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Event Tomorrow',
          description: '',
          date: '2025-12-07',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user123',
          createdAt: '2025-12-07T00:00:00.000Z',
          updatedAt: '2025-12-07T00:00:00.000Z',
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockEvents),
      );

      const events = await eventService.getEventsByDate(
        'user123',
        '2025-12-06',
      );

      expect(events).toHaveLength(1);
      expect(events[0].title).toBe('Event Today');
    });
  });
});
