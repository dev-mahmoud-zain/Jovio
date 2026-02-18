export const GeneralRegex = {
    FULL_NAME: /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&#]{8,}$/,
    PHONE_NUMBER:/^\+201(0|1|2|5)\d{8}$/,
    DATE_OF_BIRTH:/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
} as const;



export const GeneralRegexMessage = {
    FULL_NAME:
        'Full name must consist of first and last name, each starting with a capital letter (e.g. John Doe).',

    PASSWORD:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',

    PHONE_NUMBER:
        'Phone number must be a valid Egyptian number starting with +20 (10, 11, 12, or 15).',

    DATE_OF_BIRTH:
        'Date of birth must be in DD/MM/YYYY format.',
} as const;