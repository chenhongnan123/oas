import Cookies from 'js-cookie';

export const setLocale = locale => Cookies.set('locale', locale, { path: '/' });

export const getLocale = () => Cookies.get('locale');

export const set = property => (state, payload) => (state[property] = payload);

export const add = property => (state, payload) => (state[property].unshift(payload));

export const remove = property => (state, payload) => (state[property].splice(payload, 1));

export const toggle = property => state => (state[property] = !state[property]);
