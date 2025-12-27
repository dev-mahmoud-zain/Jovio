export enum GenderEnum {
  male = 'male',
  female = 'female',
}

export enum ProviderEnum {
    system = "system",
    google = "google"
}

export enum RoleEnum {
    user = "user",
    admin = "admin",
    super_admin = "super_admin",
}

export enum UserStatusEnum {
  'Looking For Internship' = 'Looking For Internship',          // بيدور على تدريب
  'Looking For Job' = 'Looking For Job',                              // بيدور على شغل
  'Employed' = 'Employed',                                                // موظف حاليًا
  'Student' = 'Student',                                                  // طالب
  'Freelancer' = 'Freelancer',                                           // مستقل / فريلانس
  'Open To Opportunities' = 'Open To Opportunities',                     // منفتح على الفرص
  'Not Looking Right Now' = 'Not Looking Right Now',                     // مش بيدور على حاجة دلوقتي
}