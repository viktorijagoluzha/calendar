export const MIN_PASSWORD_LENGTH = 6;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: MIN_PASSWORD_LENGTH,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  EVENT_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  EVENT_DESCRIPTION: {
    MAX_LENGTH: 500,
  },
} as const;
