export const WIZARD_NAMES = {
  ENABLE_BADGE: 'ENABLE_BADGE',
  CREATE_ICS: 'SELECT_FILE_FORMAT_ICS',
  CREATE_DELETE_ICS: 'SELECT_FILE_FORMAT_DELETE_ICS',
  CREATE_CSV: 'SELECT_FILE_FORMAT_CSV',
  CREATE_JSON: 'CREATE_JSON',
} as const;

export const FACEBOOK_REQUIRED_REGEXP = '^https:\\/\\/(web|www|m|l|mobile)\\.facebook\\.com';
export const isDevelopment = (process.env.NODE_ENV === 'development');
