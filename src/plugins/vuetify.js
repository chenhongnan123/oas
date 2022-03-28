import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                // primary: '#000',
                // secondary: '#000',
                // accent: '#000',
                // error: '#000',
                // info: '#000',
                // success: '#000',
                // warning: '#000',
                test: '#000'
            },
            dark: {
                // primary: '#0ff',
                // secondary: '#0ff',
                // accent: '#0ff',
                // error: '#0ff',
                test: '#fff'
            },
        },
    },
});
