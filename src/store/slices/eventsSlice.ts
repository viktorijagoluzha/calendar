import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { eventService } from '../../services/eventService';
import { Event, EventFormData, EventsState } from '../../types/Event';

const initialState: EventsState = {
  events: [],
  isLoading: false,
  selectedDate: new Date().toISOString().split('T')[0],
};

export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async (userId: string) => {
    const events = await eventService.getEvents(userId);
    return events;
  },
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async ({
    userId,
    eventData,
  }: {
    userId: string;
    eventData: EventFormData;
  }) => {
    const event = await eventService.createEvent(userId, eventData);
    return event;
  },
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({
    userId,
    eventId,
    eventData,
  }: {
    userId: string;
    eventId: string;
    eventData: EventFormData;
  }) => {
    const event = await eventService.updateEvent(userId, eventId, eventData);
    return event;
  },
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async ({ userId, eventId }: { userId: string; eventId: string }) => {
    await eventService.deleteEvent(userId, eventId);
    return eventId;
  },
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        loadEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.events = action.payload;
        },
      )
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.events = state.events.filter(e => e.id !== action.payload);
        },
      )
      .addMatcher(
        action =>
          action.type.endsWith('/pending') && action.type.startsWith('events/'),
        state => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        action =>
          (action.type.endsWith('/fulfilled') ||
            action.type.endsWith('/rejected')) &&
          action.type.startsWith('events/'),
        state => {
          state.isLoading = false;
        },
      );
  },
});

export const { setSelectedDate } = eventsSlice.actions;
export default eventsSlice.reducer;
