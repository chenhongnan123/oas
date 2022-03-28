import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ElementsService } = ServiceFactory;
export default {
  state: {
    downtimelist: [],
  },
  mutations: {
    SET_DOWNTIME: set('downtimelist'),
  },
  actions: {
    async GET_DOWNTIME({ commit, rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'downtime',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          commit('SET_DOWNTIME', results);
          return results;
        } else {
          commit('SET_DOWNTIME', []);
          return false;
        }
      } else {
        commit('SET_DOWNTIME', []);
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_DOWNTIMEREASONS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'downtimereasons',
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
    async PUT_DOWNTIMEREASON({ rootState }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElement(
        'downtime',
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
  },
  getters: {
    // enableButtons: ({ items }) => (items && items.length > 0 && items[0].quantityActual > 0),
  },
};
