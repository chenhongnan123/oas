import Service from '../plugins/axios';
import store from '@/store';
const reqConfig = { timeout: 45000 };

export default {
  getElement(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/server/elements/${elementName}/records${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  postElement(elementName, postData) {
    try {
      const siteid = store.state.setting.siteid;
      postData = { ...postData, siteid };
      const url = `/server/elements/${elementName}/records`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  putElement(elementName, _id,  postData, param) {
    try {
      param = param || '';
      const url = `/server/elements/${elementName}/records/${_id}${param}`;
      return Service.put(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  putElementByQuery(elementName, postData, param) {
    try {
      console.log( postData, param, 'postData, param');
      param = param || '';
      const url = `/server/elements/${elementName}/records${param}`;
      return Service.put(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  deleteElement(elementName, _id,  postData) {
    try {
      const url = `/server/elements/${elementName}/records/${_id}`;
      return Service.delete(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },

  getElementNoRecord(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/server/elements/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
