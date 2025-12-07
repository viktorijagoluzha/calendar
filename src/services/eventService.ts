import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, EventFormData } from '../types/Event';

const STORAGE_KEY = '@calendar_events';

export const eventService = {
  async getEvents(userId: string): Promise<Event[]> {
    try {
      const eventsData = await AsyncStorage.getItem(`${STORAGE_KEY}_${userId}`);
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  },

  async getEventsByDate(userId: string, date: string): Promise<Event[]> {
    try {
      const allEvents = await this.getEvents(userId);
      return allEvents.filter(event => event.date === date);
    } catch (error) {
      console.error('Get events by date error:', error);
      return [];
    }
  },

  async createEvent(userId: string, eventData: EventFormData): Promise<Event> {
    try {
      const events = await this.getEvents(userId);

      const year = eventData.date.getFullYear();
      const month = String(eventData.date.getMonth() + 1).padStart(2, '0');
      const day = String(eventData.date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title,
        description: eventData.description,
        date: dateString,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      events.push(newEvent);
      await AsyncStorage.setItem(
        `${STORAGE_KEY}_${userId}`,
        JSON.stringify(events),
      );

      return newEvent;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  async updateEvent(
    userId: string,
    eventId: string,
    eventData: EventFormData,
  ): Promise<Event> {
    try {
      const events = await this.getEvents(userId);
      const eventIndex = events.findIndex(e => e.id === eventId);

      if (eventIndex === -1) {
        throw new Error('Event not found');
      }

      const year = eventData.date.getFullYear();
      const month = String(eventData.date.getMonth() + 1).padStart(2, '0');
      const day = String(eventData.date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const updatedEvent: Event = {
        ...events[eventIndex],
        title: eventData.title,
        description: eventData.description,
        date: dateString,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        updatedAt: new Date().toISOString(),
      };

      events[eventIndex] = updatedEvent;
      await AsyncStorage.setItem(
        `${STORAGE_KEY}_${userId}`,
        JSON.stringify(events),
      );

      return updatedEvent;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  },

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    try {
      const events = await this.getEvents(userId);
      const filteredEvents = events.filter(e => e.id !== eventId);

      await AsyncStorage.setItem(
        `${STORAGE_KEY}_${userId}`,
        JSON.stringify(filteredEvents),
      );
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  },

  async getEventById(userId: string, eventId: string): Promise<Event | null> {
    try {
      const events = await this.getEvents(userId);
      return events.find(e => e.id === eventId) || null;
    } catch (error) {
      console.error('Get event by ID error:', error);
      return null;
    }
  },
};
