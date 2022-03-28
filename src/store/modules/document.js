import { Toast } from 'vant';
import ServiceFactory from '../../service/ServiceFactory';
import { set } from '../../utils/helper';
const { ElementsService, CommonService } = ServiceFactory;
export default {
  state: {
    previewType: 0,
    previewData: null,
  },
  mutations: {
    SETPREVIEWTYPE: set('previewType'),
    SETPREVIEWDATA: set('previewData'),
  },
  actions: {
    async GET_CATEGORYS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'category',
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
    async GET_DOCUMENTS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'document',
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
    async GET_ASSET_DOCUMENTS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'asset_document',
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
    async GET_PART_DOCUMENTS({ rootState }, param) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await ElementsService.getElement(
        'part_document',
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
    async DOWNLOADFILE({ rootState }, downloadLink) {
      const { alerterrormessagge } = rootState.setting;
      const { data, status } = await CommonService.downloadFile(downloadLink);
      if (status === 200 && data) {
          return data;
      } else {
        Toast.fail(alerterrormessagge);
        return false;
      }
    },
  },
};
