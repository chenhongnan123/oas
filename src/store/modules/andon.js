import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ElementsService } = ServiceFactory;
export default {
  state: {
    andonlist: [],
  },
  mutations: {
    SET_ANDON: set('andonlist'),
  },
  actions: {
    async GET_ANDON({ commit, rootState }, param) {
      const { servertime, alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'andonrecord',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          const andonlist = results.map(item => (
            {
              ...item,
              duration:item.duration||Math.round((servertime - item.starttimestamp)/100/60)/10||'-'
            }
          ));
          commit('SET_ANDON', andonlist);
          return andonlist;
        } else {
          commit('SET_ANDON', []);
          return false;
        }
      } else {
        commit('SET_ANDON', []);
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_ANDONREASONS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'andontype',
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
    async POST_ANDON({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.postElement(
        'andonrecord',
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
    async PUT_ANDON({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElement(
        'andonrecord',
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
    async DELETE_ANDON({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.deleteElement(
        'andonrecord',
        payload.id,
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
    async GET_ANDONPATH({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'andonpath',
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
    async POST_ANDONTASK({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.postElement(
        'andontask',
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
    async PUT_ANDONTASK({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElement(
        'andontask',
        payload.id,
        payload.payload,
        payload.param
      );
      if (status === 200) {
        if (data && data.status === 'Success') {
          return true;
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
    // enableButtons: ({ items }) => (items && items.length > 0 && items[0].quantityActual > 0),
  },
};
