import { Platform } from 'react-native';

// Current machine local IP: 10.198.92.127 (PORT 8080)
const DEV_LAN_IP = '10.198.92.127';
const PORT = '8080';

const BASE_HOST = Platform.select({
  web: `http://localhost:${PORT}`,
  // For Android Emulator you can switch to: `http://10.0.2.2:${PORT}`
  android: `http://${DEV_LAN_IP}:${PORT}`,
  ios: `http://${DEV_LAN_IP}:${PORT}`,
  default: `http://localhost:${PORT}`,
});

export const API_URL = `${BASE_HOST}/api`;

export const SIGNUP_URL  = '/account/signup';
export const LOGIN_URL   = '/account/login'; 
export const PROFILE_URL = '/account/getProfile';
export const DELETE_PROFILE_URL = '/account/deleteProfile';

export const UPDATE_PROFILE_URL = '/account/update';

export const DOCTOR_URL = '/Doctor';

export const SAVED_ME_DOCTOR  = '/account/SavedMeDoctor'
export const  LIST_ME_DOCTORS  = '/account/listMeDoctors'
export const  DELETE_ME_DOCTOR  = '/account/savedDoctors/:doctorId'