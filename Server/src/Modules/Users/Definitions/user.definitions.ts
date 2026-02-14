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
    bio: {
      MAX: 500,
    },
    reason: {
      MAX:500,
    },
    skills: {
      MAX_ITEMS: 50,
    },
  };
  
  static readonly REGEX = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^\+?[1-9]\d{1,14}$/,
    DATE_STRING: /^\d{4}-\d{2}-\d{2}$/,
  };
}
