export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export interface EventsState {
  events: Event[];
  isLoading: boolean;
  selectedDate: string;
}
