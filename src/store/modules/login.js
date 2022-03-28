import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ElementsService } = ServiceFactory;
export default {
  state: {
    isAuthorized: false,
    authdialog: false,
    authaction: '',
  },
  mutations: {
    SET_AUTHORIZED: set('isAuthorized'),
    SET_AUTHDIALOG: set('authdialog'),
    SET_AUTHACTION: set('authaction'),
  },
  actions: {
    async LOGIN({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { username, password } = payload;
      let param = `?query=operatorcode=="${username}"`;
      if (password) {
        param += `%26%26password=="${password}"`;
      }
      const { data, status } = await ElementsService.getElement(
        'operator',
        param
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          return results;
        } else {
          Toast.fail('账号或密码错误');
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GETOPERATOR({ commit, rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { machinename, operatorstatus, operatorcode } = payload;
      let param = `?query=machinename=="${machinename}"%26%26status=="${operatorstatus}"`;
      if (operatorcode) {
        param += `%26%26operatorcode=="${operatorcode}"`;
      }
      const { data, status } = await ElementsService.getElement(
        'operatorlog',
        param
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          commit('SET_AUTHORIZED', true);
          return results;
        } else {
          commit('SET_AUTHORIZED', false);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async POSTOPERATOR({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.postElement(
        'operatorlog',
        payload
      );
      if (status === 200) {
        if (data && data.id) {
          return true;
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async PUTOPERATOR({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElement(
        'operatorlog',
        payload.id,
        payload.payload
      );
      if (status === 200) {
        if (data && data.id) {
          return true;
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async PUTOPERATORBYQUERY({ rootState }, payload) {
      console.log(payload, 'payload');
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElementByQuery(
        'operatorlog',
        payload.payload,
        payload.param,
      );
      if (status === 200) {
        if (data && data.id) {
          return true;
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_POSITIONAUTH({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'positionauth',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          return results;
        } else {
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    HANDLE_AUTHACTION({ commit }, payload) {
      const { authaction, callback } = payload
      commit('SET_AUTHACTION', authaction);
      commit('SET_AUTHDIALOG', true);
      this.authcallback = callback;
    },
    AUTHCALLBACK(hold, operator) {
      this.authcallback(operator);
    },
  },
  getters: {
    // enableButtons: ({ items }) => (items && items.length > 0 && items[0].quantityActual > 0),
  },
};
