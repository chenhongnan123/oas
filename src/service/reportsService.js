import Service from '../plugins/axios';

const reqConfig = { timeout: 45000 };

export default {
  getReport(reportName, postData, queryParams) {
    try {
      const query = queryParams || '';
      const url = `/server/executereport/${reportName}${query}`;
      return Service.post(url, postData, reqConfig);
    } catch (e) {
      throw new Error(e);
    }
  },
};
