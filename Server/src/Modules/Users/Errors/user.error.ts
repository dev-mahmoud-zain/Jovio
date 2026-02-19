export const UserErrors = {
  FULL_NAME:
    'Full name must consist of first and last name, each starting with a capital letter (e.g. John Doe).',

  PASSWORD:
    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).',

  PHONE_NUMBER:
    'Phone number must be a valid Egyptian phone number starting with +2010, +2011, +2012, or +2015 followed by 8 digits.',

  DATE_OF_BIRTH: 'Date of birth must be in DD/MM/YYYY format.',
} as const;
