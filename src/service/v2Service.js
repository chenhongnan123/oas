import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };

export default {
  getElementV2(serverIp, elementName, customerId, userId, queryParams) {
    try {
      const query = queryParams || '';
      const url = `http://${serverIp}/server/${elementName}?customerid=${customerId}&userid=${userId}${query}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  authenticate(serverIp, postData) {
    try {
      const url = `http://${serverIp}/server/authenticate`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  getRole(serverIp, roleId, customerId) {
    try {
      const url = `http://${serverIp}/server/role/${roleId}?customerid=${customerId}`;
      return Service.get(url, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
  postBulkRecordsV2(serverIp, elementName, customerId, userId, postData) {
    try {
      const url = `http://${serverIp}/server/elements/${elementName}/createbulkrecords/v2?customerid=${customerId}&userid=${userId}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
