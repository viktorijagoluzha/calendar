export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const MONTHS = [
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
] as const;

export const MAX_EVENT_TITLE_LENGTH = 100;
export const MAX_EVENT_DESCRIPTION_LENGTH = 500;

export const DEFAULT_TIME_FORMAT = {
  START: '09:00',
  END: '10:00',
} as const;

export const DATE_FORMAT = {
  STORAGE: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
} as const;
