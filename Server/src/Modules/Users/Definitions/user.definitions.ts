import { BaseDefinitions } from 'src/Common/Definitions/base.definition';

export class UserDefinitions implements BaseDefinitions {
  static readonly LIMITS = {
    firstName: {
      MIN: 2,
      MAX: 30,
    },
    lastName: {
      MIN: 2,
      MAX: 30,
    },
    fullName: {
      MIN: 5,
      MAX: 61,
    },
    bio: {
      MAX: 500,
    },
    reason: {
      MAX: 500,
    },
    skills: {
      MAX_ITEMS: 50,
    },
  };

  static readonly REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&#]{8,}$/,
    PHONE_NUMBER: /^\+?[1-9]\d{1,14}$/,
    FULL_NAME: /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    DATE_STRING: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
  };
}
