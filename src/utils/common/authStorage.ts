import { STORAGE_KEYS } from '../constants/constants';

export const clearStoredAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};
