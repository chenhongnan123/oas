import Cookies from 'js-cookie';

export const setLocale = locale => Cookies.set('locale', locale, { path: '/' });

export const getLocale = () => Cookies.get('locale');
