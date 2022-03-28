import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ElementsService } = ServiceFactory;
export default {
  state: {
    rejectionlist: [],
  },
  mutations: {
    SET_REJECTION: set('rejectionlist'),
  },
  actions: {
    async GET_REJECTION({ commit, rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'rejection',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          commit('SET_REJECTION', results);
          return results;
        } else {
          commit('SET_REJECTION', []);
          return false;
        }
      } else {
        commit('SET_REJECTION', []);
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_REJECTIONREASONS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'rejectionreasons',
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
    async POST_REJECTION({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.postElement(
        'rejection',
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
    async DELETE_REJECTION({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.deleteElement(
        'rejection',
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
  },
  getters: {
    // enableButtons: ({ items }) => (items && items.length > 0 && items[0].quantityActual > 0),
  },
};
