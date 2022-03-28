import { Toast } from 'vant';
import { set } from '../../utils/helper';
import ServiceFactory from '../../service/ServiceFactory';
const { ReportsService } = ServiceFactory;
const mergeArr = (arr,n) => {
  const newArr=[];
  const temp = {};
  for(let i in arr) {
      var key = arr[i][n];
      if(temp[key]) {
          // temp[key][n] = temp[key][n];
          for(let j in arr[0]){
              if(j !== n){
                  temp[key][j] = temp[key][j] + arr[i][j];
              }
          }
      } else {
          temp[key] = {};
          for(let j in arr[0]){
              temp[key][j] = arr[i][j];
          }
      }
  }
  for(let k in temp){
      newArr.push(temp[k])
  }
  return newArr
}
export default {
  state: {
    shifterformancereport: {},
    hourlydowntimereport: null,
    hourlyproductionreport: null,
    hourlyproductionparameter: null,
    shiftcategory: null,
  },
  mutations: {
    SET_SHIFTCATEGORY: set('shiftcategory'),
    SET_SHIFTPRODUCTIONREPORT: set('shifterformancereport'),
    SET_HOURLYDOWNTIMEREPORT: set('hourlydowntimereport'),
    SET_HOURLYPRODUCTIONREPORT: set('hourlyproductionreport'),
    SET_HOURLYPRODUCTIONPARAMETER: set('hourlyproductionparameter'),
  },
  actions: {
    async GETINTERVALDATA({ dispatch, rootState }) {
      await dispatch('setting/GET_BUSINESSTIME', null, { root: true });
      await dispatch('setting/GET_SHIFT', null, { root: true });
      const { machinename, businesstime } = rootState.setting;
      const { date, shiftName } = businesstime;
      const payload = {
        postData: {
          start: Number(date),
          end: Number(date),
          siteid: Number(localStorage.getItem('siteid'))
        },
        param: '?all=false'
      };
      const payloadshift = {
        postData: {
          dateVal: Number(date),
          shiftVal: shiftName,
          siteid: Number(localStorage.getItem('siteid'))
        },
        param: '?all=false'
      };
      const payloadcycletime = {
        postData: {
          start: Number(date),
          end: Number(date),
          siteid: Number(localStorage.getItem('siteid')),
          shiftVal: shiftName,
          machineVal: machinename,
        },
        param: '?all=false'
      };
      await dispatch('GET_SHIFTCATEGORY');
      dispatch('GET_SHIFTPERFORMANCEREPORT', payloadshift);
      dispatch('GET_HOURLYDOWNTIMEREPORT', payload);
      dispatch('GET_HOURLYPRODUCTIONREPORT', payload);
      dispatch('GET_HOURLYPRODUCTIONPARAMETER', payloadcycletime);
      dispatch('GETPLAN');
    },
    async GETPLAN({ dispatch, rootState }) {
      const { machinename } = rootState.setting;
      const param = `?query=status==%22inProgress%22%7C%7Cstatus==%22notStarted%22%7C%7Cstatus==%22paused%22%26%26(machinename==%22${machinename}%22)&&sortquery=sortindex==1`;
      dispatch('plan/GET_PLANNING', param, { root: true });
    },
    async GET_HOURLYPRODUCTIONREPORT({ commit, rootState, state }, payload) {
      const { alerterrormessagge } = rootState.setting;
      const { machinename, businesstime } = rootState.setting;
      const { shiftcategory } = state;
      const { shiftName } = businesstime;
      const { postData, param } = payload;
      const { data, status } = await ReportsService.getReport(
        'hourlymachineproduction',
        postData,
        param
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData).reportData;
        if (reportData.length > 0) {
          reportData = reportData.filter(item => item.machinename === machinename && item.shift === shiftName);
          reportData = mergeArr(reportData, 'hour');
          // console.log(reportData, 'reportData123...........................');
          const arr = [];
          shiftcategory.forEach((item) => {
            const reportobj = reportData.find((report) => (report.hour.substr(0,5)).includes(item));
            if (reportobj) {
              arr.push(
                {
                  ...reportobj,
                  displayHour: item,
                }
              );
            } else {
              arr.push(
                {
                  accepted: 0,
                  date: "",
                  displayHour: item,
                  machinename: "",
                  partname: "",
                  planid: "",
                  produced: 0,
                  rejected: 0,
                  shift: "",
                  target: 0,
                }
              );
            }
          });
          commit('SET_HOURLYPRODUCTIONREPORT', arr);
          return arr;
        } else {
          commit('SET_HOURLYPRODUCTIONREPORT', []);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_HOURLYPRODUCTIONPARAMETER({ commit, rootState, state }, payload) {
      const { shiftcategory } = state;
      const { alerterrormessagge } = rootState.setting;
      const { postData, param } = payload;
      const { data, status } = await ReportsService.getReport(
        'productionparameter',
        postData,
        param
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData).productionparameter;
        if (reportData.length > 0) {
          // console.log(reportData, 'productionparameter..............................');
          // console.log(shiftcategory, 'shiftcategory..............................');
          const arr = [];
          shiftcategory.forEach((item) => {
            const reportobj = reportData.find((report) => (report.displayHour.substr(0,5)).includes(item));
            if (reportobj) {
              arr.push(
                {
                  ...reportobj,
                  displayHour: item,
                }
              );
            } else {
              arr.push(
                {
                  avg: 0,
                  date: 0,
                  displayHour: item,
                  machinename: "",
                  max: 0,
                  min: 0,
                  shiftName: ""
                }
              );
            }
          });
          commit('SET_HOURLYPRODUCTIONPARAMETER', arr);
          return arr;
        } else {
          commit('SET_HOURLYPRODUCTIONPARAMETER', []);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
    async GET_SHIFTPERFORMANCEREPORT({ commit, dispatch, rootState, rootGetters }, payload) {
      const shiftStartTime = rootGetters['setting/shiftStartTime'];
      const { servertime, alerterrormessagge } = rootState.setting;
      const { machinename } = rootState.setting;
      const { postData, param } = payload;
      const { data, status } = await ReportsService.getReport(
        'shiftliveshopfloor',
        postData,
        param
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData).machines;
        if (reportData.length > 0) {
          const query = `?starttime=${shiftStartTime}&endtime=${servertime}`
          const noworkingtime = await dispatch('setting/GET_NOWORKINGTIME', query, { root: true });
          const shiftReportData = reportData.find(item => item.machinename === machinename);
          if (noworkingtime) {
            shiftReportData.workingtime = servertime - shiftStartTime - noworkingtime;
          } else {
            shiftReportData.workingtime = servertime - shiftStartTime;
          }
          // console.log(shiftReportData, 'shiftreportData......');
          commit('SET_SHIFTPRODUCTIONREPORT', shiftReportData||{});
          return shiftReportData;
        } else {
          commit('SET_SHIFTPRODUCTIONREPORT', {});
          return {};
        }
      } else {
        Toast.fail(alerterrormessagge);
        return {};
      }
    },
    async GET_HOURLYDOWNTIMEREPORT({ commit, rootState, state }, payload) {
      const { shiftcategory } = state;
      const { alerterrormessagge } = rootState.setting;
      const { machinename } = rootState.setting;
      const { postData, param } = payload;
      const { data, status } = await ReportsService.getReport(
        'hourlymachineperformance',
        postData,
        param
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData).reportData;
        if (reportData.length > 0) {
          reportData = reportData.filter(item => item.machinename === machinename);
          // console.log(reportData, 'downtimereportData.......................');
          reportData = mergeArr(reportData, 'hour');
          const arr = [];
          shiftcategory.forEach((item) => {
            const reportobj = reportData.find((report) => (report.hour.substr(0,5)).includes(item));
            if (reportobj) {
              arr.push(
                {
                  ...reportobj,
                  displayHour: item,
                  totaldowntime: reportobj.runtime,
                  totaldowntimeinmins: reportobj.runtime/1000/60,
                }
              );
            } else {
              arr.push(
                {
                  date: "",
                  downtimereason: "",
                  displayHour: item,
                  machinename: "",
                  shift: "",
                  totaldowntime: 0,
                  totaldowntimeinmins: 0,
                }
              );
            }
          });
          commit('SET_HOURLYDOWNTIMEREPORT', arr);
          return arr;
        } else {
          commit('SET_HOURLYDOWNTIMEREPORT', []);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
          return false;
      }
    },
    async GET_SHIFTCATEGORY({ commit, rootState }) {
      const { alerterrormessagge } = rootState.setting;
      const { businesstime } = rootState.setting;
      const { shiftName } = businesstime;
      const { data, status } = await ReportsService.getReport(
        'shifthour',
        {},
        '?all=false'
      );
      if (status === 200) {
        let { reportData } = data;
        reportData = JSON.parse(reportData).reportData;
        if (reportData.length > 0) {
          reportData = reportData.filter(item => item.shift === shiftName);
          const shifthour = reportData[0].shifthour.map(item => parseFloat(item) < 10 ? '0'+item : item);
          commit('SET_SHIFTCATEGORY', shifthour);
          return reportData;
        } else {
          commit('SET_SHIFTCATEGORY', false);
          return false;
        }
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
  },
};
