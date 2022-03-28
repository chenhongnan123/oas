import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ElementsService, ReportsService } = ServiceFactory;
export default {
  state: {
    currentplan: [],
    planlist: [],
  },
  mutations: {
    SET_PLAN: set('currentplan'),
    SET_PLANLIST: set('planlist'),
  },
  actions: {
    async GET_PLANNING({ commit, dispatch, rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'planning',
        param
      );
      let { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          const moldparam = results.reduce((pre, cur, key) => `${pre}${key === 0 ? '' : '%7C%7C'}moldnumber==%22${cur.moldnumber}%22`, '?query=');
          const partparam = results.reduce((pre, cur, key) => `${pre}${key === 0 ? '' : '%7C%7C'}partname==%22${cur.partname}%22`, '?query=');
          const moldlist = await dispatch('GET_MOLDS', moldparam);
          const partlist = await dispatch('GET_PARTS', partparam);
          if (moldlist.length > 0) {
            results = results.map((item) => (
              {
                ...item,
                moldlocation: moldlist.find(mold => item.moldnumber === mold.moldnumber) 
                              ? moldlist.find(mold => item.moldnumber === mold.moldnumber).moldlocation
                              : '',
              }
            ));
          }
          if (partlist.length > 0) {
            results = results.map((item) => (
              {
                ...item,
                partnumber: partlist.find(part => item.partname === part.partname)
                            ? partlist.find(part => item.partname === part.partname).partnumber
                            : '',
                partdescription: partlist.find(part => item.partname === part.partname)
                                 ? partlist.find(part => item.partname === part.partname).partdescription
                                 : '',
              }
            ));
          }
          
          let inprogressresults = results.filter(item => item.status === 'inProgress');
          let pausedresults = results.filter(item => item.status === 'paused');
          let notstartresults = results.filter(item => item.status === 'notStarted');
          const plansummary = await dispatch('GET_PLANSUMMARY', [...inprogressresults, ...pausedresults]);
          if (inprogressresults.length > 0) {
            inprogressresults = inprogressresults.map(item => {
              const summaryobj = plansummary.find(summary => item.partname === summary.partname);
              return {
                ...item,
                actualquantity: summaryobj ? summaryobj.actualquantity : '-',
              }
            })
            pausedresults = pausedresults.map(item => {
              const summaryobj = plansummary.find(summary => item.partname === summary.partname);
              return {
                ...item,
                isSelectable: false,
                actualquantity: summaryobj ? summaryobj.actualquantity : '-',
              }
            });
            notstartresults = notstartresults.map(item => {
              return {
                ...item,
                isSelectable: false,
              }
            });
          } else {
            pausedresults = pausedresults.map(item => {
              const summaryobj = plansummary.find(summary => item.partname === summary.partname);
              return {
                ...item,
                actualquantity: summaryobj ? summaryobj.actualquantity : '-',
              }
            });
          }
          commit('SET_PLAN', inprogressresults);
          commit('SET_PLANLIST', [...inprogressresults, ...pausedresults, ...notstartresults]);
          return results.reverse();
        } else {
          commit('SET_PLAN', []);
          commit('SET_PLANLIST', []);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async PUT_PLAN({rootState}, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.putElement(
        'planning',
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
    async GET_MOLDS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'mold',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          return results;
        } else {
          return [];
        }
      } else {
        Toast.fail(alerterrormessagge);
        return [];
      }
    },
    async GET_PARTS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'part',
        param||''
      );
      const { results } = data;
      if (status === 200) {
        if (results.length > 0) {
          return results;
        } else {
          return [];
        }
      } else {
        Toast.fail(alerterrormessagge);
        return [];
      }
    },
    async GET_PLANSUMMARY({rootState}, currentplan) {
      const { alerterrormessagge } = rootState.setting;
      if (currentplan.length === 0) {
        return [];
      }
      const postData = {
        planFilter: `{${currentplan[0].planid}}`,
        siteid: Number(localStorage.getItem('siteid'))
      };
      const param = '?all=false';
      const { data, status } = await ReportsService.getReport(
        'plansummary',
        postData,
        param
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData);
        if (reportData.length > 0) {
          return reportData;
        } else {
          return [];
        }
      } else {
        Toast.fail(alerterrormessagge);
        return [];
      }
    },
  },
  getters: {
    // enableButtons: ({ items }) => (items && items.length > 0 && items[0].quantityActual > 0),
  },
};
