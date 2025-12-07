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
      .addCase(loadEvents.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        loadEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.isLoading = false;
          state.events = action.payload;
        },
      )
      .addCase(loadEvents.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(createEvent.pending, state => {
        state.isLoading = true;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(updateEvent.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.isLoading = false;
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, state => {
        state.isLoading = false;
      });

    builder
      .addCase(deleteEvent.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.events = state.events.filter(e => e.id !== action.payload);
        },
      )
      .addCase(deleteEvent.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { setSelectedDate } = eventsSlice.actions;
export default eventsSlice.reducer;
