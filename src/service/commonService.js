import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };

export default {
  getFile(elementName) {
    try {
      const url = `${elementName}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  getService(elementName, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/server/${elementName}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postService(elementName, queryParams, postData) {
    try {
      const query = queryParams || '';
      const url = `/server/${elementName}${query}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  downloadFile(downloadLink) {
    return Service.get(`${downloadLink}?disposition=attachment`, {
      responseType: 'blob',
    });
  }
};
