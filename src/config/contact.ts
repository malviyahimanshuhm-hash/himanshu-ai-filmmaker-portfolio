export const CONTACT_CONFIG = {
  PHONE_NUMBER: '',
  EMAIL_ADDRESS: '',
  INSTAGRAM_URL: '',
  YOUTUBE_URL: '',
  LINKEDIN_URL: '',
};

export const isConfigured = {
  phone: !!CONTACT_CONFIG.PHONE_NUMBER,
  email: !!CONTACT_CONFIG.EMAIL_ADDRESS,
  instagram: !!CONTACT_CONFIG.INSTAGRAM_URL,
  youtube: !!CONTACT_CONFIG.YOUTUBE_URL,
  linkedin: !!CONTACT_CONFIG.LINKEDIN_URL,
};

export const hasAnyContact = () => {
  return isConfigured.phone || isConfigured.email || isConfigured.instagram || isConfigured.youtube || isConfigured.linkedin;
};
