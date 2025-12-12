export const translations = {
  en: {
    auth: {
      login: 'Login',
      signUp: 'Sign up',
      signIn: 'Sign in',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      forgotPassword: 'Forgot password?',
      resetPasswordInstructions:
        "Enter your email address and we'll send you instructions to reset your password",
      dontHaveAccount: "Don't have an account? ",
      alreadyHaveAccount: 'Already have an account? ',
      createAccount: 'Create your account',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterFullName: 'Enter your full name',
      reenterPassword: 'Re-enter your password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      enterCurrentPassword: 'Enter current password',
      enterNewPassword: 'Enter new password',
      confirmNewPasswordPlaceholder: 'Confirm new password',
      resetPassword: 'Reset Password',
      biometricLogin: 'Biometric Login',
      or: 'OR',
    },
    calendar: {
      calendar: 'Calendar',
      todaysEvents: "Today's events",
      noEventsScheduled: 'No events scheduled',
      createEvent: 'Create Event',
      editEvent: 'Edit Event',
      eventTitle: 'Event Title',
      date: 'Date',
      startTime: 'Start Time',
      endTime: 'End Time',
      description: 'Description',
      save: 'Save',
      delete: 'Delete',
      cancel: 'Cancel',
      enterEventTitle: 'Enter event title',
      enterDescription: 'Enter description (optional)',
      tapToViewDetails: 'Tap to view event details',
    },
    profile: {
      profile: 'Profile',
      editProfile: 'Edit profile',
      personalInformation: 'Personal Information',
      changePassword: 'Change Password',
      biometricLogin: 'Biometric Login',
      logout: 'Logout',
      changePhoto: 'Change Photo',
      saveChanges: 'Save Changes',
    },
    common: {
      appName: 'CalendFlow',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      ok: 'OK',
      yes: 'Yes',
      no: 'No',
      back: 'Back',
      error: 'Error',
      success: 'Success',
      loading: 'Loading...',
    },
    errors: {
      fillAllFields: 'Please fill in all fields',
      passwordsNotMatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 6 characters',
      invalidEmail: 'Please enter a valid email address',
      enterEmail: 'Please enter your email',
      enterPassword: 'Please enter email and password',
      enterFullName: 'Please enter your full name',
      enterEventTitle: 'Please enter event title',
      userNotFound: 'User not found',
      signInFailed: 'Sign In Failed',
      signUpFailed: 'Sign Up Failed',
      accountCreationFailed: 'Failed to create account',
      invalidCredentials: 'Invalid credentials',
      authFailed: 'Authentication Failed',
      createEventFailed: 'Failed to create event',
      updateEventFailed: 'Failed to update event',
      updateProfileFailed: 'Failed to update profile',
      deleteEventFailed: 'Failed to delete event',
      eventNotFound: 'Event not found',
      signOutFailed: 'Failed to sign out',
      biometricToggleFailed: 'Failed to toggle biometric authentication',
      enterCurrentPassword:
        'Please enter your current password to change password',
      currentPasswordIncorrect: 'Current password is incorrect',
      biometricNotAvailable:
        'Biometric authentication is not available on this device',
    },
    success: {
      accountCreated: 'Account created successfully',
      eventCreated: 'Event created successfully',
      eventUpdated: 'Event updated successfully',
      eventDeleted: 'Event deleted successfully',
      profileUpdated: 'Profile updated successfully',
      passwordResetSent: 'Password reset link sent to your email',
    },
    confirmations: {
      signOut: 'Sign Out',
      signOutMessage: 'Are you sure you want to sign out?',
      deleteEvent: 'Delete Event',
      deleteEventMessage: 'Are you sure you want to delete this event?',
    },
    days: {
      sun: 'Sun',
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
    },
    months: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',
    },
  },
};

export type TranslationKeys = typeof translations.en;
export type Language = keyof typeof translations;

let currentLanguage: Language = 'en';

export const setLanguage = (language: Language) => {
  currentLanguage = language;
};

export const getLanguage = (): Language => {
  return currentLanguage;
};

export const t = (path: string): string => {
  const keys = path.split('.');
  let value: any = translations[currentLanguage];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
};
