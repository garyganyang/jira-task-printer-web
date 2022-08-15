import * as base64 from 'js-base64';
import * as axiosService from './axiosInterceptor';

// Jira Rest Api 说明
// https://docs.atlassian.com/software/jira/docs/api/REST/7.4.1/#auth/1/session-login
// https://docs.atlassian.com/jira-software/REST/7.0.4/
const apiServe = {
  login() {
    const url = '/rest/auth/1/session';
    const { username, credential } = JSON.parse(localStorage.getItem('TaskPrinterConf') || '{"username":"", "credential":""}');
    return axiosService.postAction(url, {
      username,
      password: base64.decode(`${credential}`),
    });
  },
  getMyself() {
    const url = '/rest/api/2/myself';
    return axiosService.getAction(url);
  },
  getAllAgileBoard(startAt=0) {
    const url = `/rest/agile/1.0/board?startAt=${startAt}`;
    // const data = JSON.parse(localStorage.getItem('TaskPrinterConf') || '{}');
    return axiosService.getAction(url, {
      headers: {
        // Authorization: `Basic ${data.auth}`,
      },
    });
  },
  getAllSprints(boardId) {
    const url = `/rest/agile/1.0/board/${boardId}/sprint`;
    return axiosService.getAction(url, {
      headers: {},
    });
  },
  getAllIssue(boardId) {
    const url = `/rest/agile/1.0/board/${boardId}/issue?maxResults=9999`;
    return axiosService.getAction(url, {
      headers: {},
    });
  },
  getIssuesForSprint(boardId, sprintId) {
    const url = `/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue?maxResults=9999`;
    return axiosService.getAction(url, {
      headers: {},
    });
  },
  getIssueByIdOrKey(issueIdOrKey) {
    const url = `/rest/agile/1.0/issue/${issueIdOrKey}`;
    return axiosService.getAction(url, {
      headers: {},
    });
  },

};
export default apiServe;
