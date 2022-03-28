import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getLocale } from '@/utils/cookies';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const detectLanguage = () => {
  const locale = getLocale();
  if (locale) {
    return locale;
  }
  return window.navigator.language.split('-')[0] || 'en';
};
export default new VueI18n({
  locale: detectLanguage(),
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
