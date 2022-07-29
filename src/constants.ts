export const WIZARD_NAMES = {
  ENABLE_BADGE: 'ENABLE_BADGE',
  CREATE_ICS: 'SELECT_FILE_FORMAT_ICS',
  CREATE_DELETE_ICS: 'SELECT_FILE_FORMAT_DELETE_ICS',
  CREATE_CSV: 'SELECT_FILE_FORMAT_CSV',
  CREATE_CSV_DATA: 'SELECT_FILE_FORMAT_CSV_DATA',
  CREATE_JSON: 'CREATE_JSON',
} as const;

export const FACEBOOK_REQUIRED_REGEXP = '^https:\\/\\/(web|www|m|l|mobile)\\.facebook\\.com';

export const isDevelopment = (process.env.NODE_ENV === 'development');
export const isFakeNames = true;
export const isShowTools = true;

export const FAKE_NAMES = [
  'Liam', 'Olivia',
  'Noah', 'Emma',
  'Oliver', 'Ava',
  'William', 'Sophia',
  'Elijah', 'Isabella',
  'James', 'Charlotte',
  'Benjamin', 'Amelia',
  'Lucas', 'Mia',
  'Mason', 'Harper',
  'Ethan', 'Evelyn',
];

export const FAKE_SECOND_NAMES = [
  'Smith', 'Johnson',
  'Williams', 'Brown',
  'Jones', 'Garcia',
  'Miller', 'Davis',
  'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez',
  'Gonzalez', 'Wilson',
  'Anderson', 'Thomas',
  'Taylor', 'Moore',
  'Jackson', 'Martin',
  'Lee', 'Perez',
  'Thompson',
];

export function fakeName(): string {
  return `${FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]
  } ${FAKE_SECOND_NAMES[Math.floor(Math.random() * FAKE_SECOND_NAMES.length)]}`;
}
