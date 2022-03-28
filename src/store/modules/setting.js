import { set } from '../../utils/helper';
import Service from '@/plugins/axios';
import moment from 'moment';
import { Toast } from 'vant';
import Cookies from 'js-cookie';
import ServiceFactory from '../../service/ServiceFactory';
const { CommonService, ElementsService } = ServiceFactory;
let timeout = null;
export default {
  state: {
    config: null,
    sessionId: '',
    servertime: '',
    isLoading: false,
    isShowKeyboard: false,
    keyboardValue: '',
    machinename: localStorage.getItem('machinename') || '',
    shift: '',
    // shiftname: '',
    businesstime: {},
    alerterrormessagge: '',
    siteid: localStorage.getItem('siteid') || '',
  },
  mutations: {
    SET_CONFIG: set('config'),
    SET_SESSIONID: set('sessionId'),
    SET_SERVERTIME: set('servertime'),
    SET_lOADING: set('isLoading'),
    SET_KEYBOARD: set('isShowKeyboard'),
    SET_KEYBOARD_VALUE: set('keyboardValue'),
    SET_MACHINENAME: set('machinename'),
    SET_SHIFT: set('shift'),
    // SET_SHIFTNAME: set('shiftname'),
    SET_BUSINESSTIME: set('businesstime'),
    SET_ALERTERRORMSSAGE: set('alerterrormessagge'),
    SET_SITEID: set('siteid'),
  },
  actions: {
    GET_CONFIG:async ({ commit }) => {
      const { data } = await CommonService.getFile(
        './config-13.json',
      );
      commit('SET_CONFIG', data);
      return data;
    },
    GET_SESSIONID:async ({dispatch,commit}) => {
      const config = await dispatch('GET_CONFIG');
      const { auth } = config;
      const { identifier, password } = auth;
      const { data } = await CommonService.postService(
        'authenticate',
        null,
        {
          identifier,
          password
        }
      );
      const { sessionId } = data;
      Service.defaults.headers.common.sessionId = sessionId;
      // const { results } = data;
      // commit('helper/SET_lOADING', false, {root: true});
      if (data && data.sessionId) {
        commit('SET_SESSIONID', data.sessionId);
        Cookies.set('sessionId', data.sessionId);
        await dispatch('GET_SERVERTIME');
        await dispatch('GET_SHIFT');
        await dispatch('GET_BUSINESSTIME');
        if (!localStorage.getItem('siteid')) {
          dispatch('GET_SESSIONDETAIL');
        }
        return true;
      }
      return false;
    },
    GET_SESSIONDETAIL:async ({ commit, }) => {
      const { data, status } = await CommonService.getService(
        '/users/mydetails',
      );
      const { results } = data;
      const { site } = results;
      if (status === 200) {
        commit('SET_SITEID', site[0].id);
        localStorage.setItem('siteid', site[0].id);
        return true;
      }
      return false;
    },
    async GET_MACHINE({rootState}) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'machine',
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          return results.sort((a,b) => Number(b.machinename.substr(1)) - Number(a.machinename.substr(1)));
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_BUSINESSTIME({ state, commit, rootState }) {
      const { alerterrormessagge } = rootState.setting;
      const { servertime } = state;
      const { data, status } = await CommonService.getService(
        'businesstime',
        `?timestamp=${servertime}`
      );
      if (status === 200) {
        commit('SET_BUSINESSTIME', data);
        return true;
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_SERVERTIME({dispatch}) {
      const { data, status } = await CommonService.getService('servertime')
      if (status === 200 && !data.Error) {
        const { results } = data;
        const timedifference = moment().valueOf() - results;
        dispatch('TIMER', timedifference);
      }
    },
    TIMER({commit, dispatch},timedifference) {
      const servertime = moment().valueOf() - timedifference;
      commit('SET_SERVERTIME', servertime);
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
        dispatch('TIMER', timedifference);
      },1000)
    },
    async GET_NOWORKINGTIME(hold, query) {
      const { data, status } = await CommonService.getService('getnonworkingtime', query)
      if (status === 200 && !data.Error) {
        return data.results;
      }
      return 0;
    },
    async GET_SHIFT({ commit, rootState }) {
      // const { servertime } = state;
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'businesshours',
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          // const currentmonthformat = moment(servertime).format('YYYY-MM');
          // const currentday = new Date(servertime).getDate();
          // const currenthour = new Date(servertime).getHours();
          // results.forEach(item => {
          //   item.starttime = parseFloat(item.starttime);
          //   item.endtime = parseFloat(item.endtime);
          //   if (item.starttime > item.endtime) {
          //     item.endtime += 24;
          //   }
          // });
          // let shiftname = '';
          // const shift = results.find(item => item.starttime < currenthour && item.endtime > currenthour);
          // if (shift) {
          //   shiftname = results.find(item => item.starttime < currenthour && item.endtime > currenthour).name;
          // }
          // if (shift.starttime > currenthour) {
          //   shift.starttimestamp = new Date(`${currentmonthformat}-${currentday-1} ${shift.starttime}:00:00`).getTime();
          // }
          // if (results[results.length - 1].starttime > currenthour) {
          //   results[results.length - 1].starttimestamp = new Date(`${currentmonthformat}-${currentday-1} ${results[results.length - 1].starttime}:00:00`).getTime();
          //   results[results.length - 1].endtimetimestamp = new Date(`${currentmonthformat}-${currentday} ${results[results.length - 1].endtime}:00:00`).getTime();
          //   results[0].starttimestamp = new Date(`${currentmonthformat}-${currentday} ${results[0].starttimestamp}:00:00`).getTime();
          //   results[0].endtimetimestamp = new Date(`${currentmonthformat}-${currentday} ${results[0].endtime}:00:00`).getTime();
          //   // results[0].endtimestamp = moment(servertime).format('YYYY-MM-DD');
          // } else {
          //   results[results.length - 1].starttimestamp = new Date(`${currentmonthformat}-${currentday} ${results[results.length - 1].starttime}:00:00`).getTime();
          //   results[0].endtimetimestamp = new Date(`${currentmonthformat}-${currentday + 1} ${results[0].endtime-24}:00:00`).getTime();
          //   // results[results.length - 1].starttimestamp = moment(servertime).format('YYYY-MM-DD');
          // }
          // commit('SET_SHIFTNAME', shiftname);
          commit('SET_SHIFT', results);
          return results;
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
  },
  getters: {
    shiftStartTime: ({ shift, businesstime }) => {
      const shiftName = businesstime.shiftName;
      const shiftDate = businesstime.date;
      const currentshift = shift.find((s) => s.shift === shiftName);
      const [hr, min] = currentshift.starttime.split(':');
      const date = shiftDate.toString();
      const year = date.substring(0, 4);
      const month = date.substring(6, 4);
      const day = date.substring(8, 6);
      return new Date(year, month - 1, day, parseInt(hr, 10), parseInt(min, 10), 0).getTime();
    },
  },
};
