import axios from 'axios';
// import app from '@/main';
// import qs from 'qs'
// axios.defaults.withCredentials = true;
const axiosService = {
  axios: axios.create({
    // eslint-disable-next-line no-undef
    baseURL: process.env.VUE_APP_HOST,
    // baseURL: '',
    // baseURL: 'https://api.car.ddh.cjiedata.com'
    // timeout: 10000
  }),
};

// const apiHost = 'http://192.168.0.85'

axiosService.axios.interceptors.request.use((config) => {
  // console.log('config', config);
  console.log('');
  // config.headers['Content-Type'] = 'application/json';
  // if (localStorage.getItem('E-m-token') && localStorage.getItem('E-m-token') !== 'undefined') {
  //   config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('E-m-token');
  // }
  // app.$vux.loading.show({
  //   text: '数据加载中……'
  // })
  // config.method === 'post'
  //   ? config.data = qs.stringify({...config.data})
  //   : config.params = {...config.params}
  // if (storageService.getToken()) {
  // config.headers['Authorization'] = 'Bearer ' + storageService.getToken()
  // config.headers['Authorization'] = ''
  //   // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // }
  return config;
}, (error) => {
  console.log(`request错误：${JSON.stringify(error)}`);
  // app.$message.error('错误：' + error);
  Promise.reject(error);
});

// axiosService.axios.interceptors.response.use((response) => {
//   if (response.data) return response;
//   // if (response.data.code === 20014 || response.data.message === '未登录') {
//   //   app.$message.error({
//   //     showClose: true,
//   //     message: '无法获取登录信息, 请重新登录'
//   //   })
//   //   app.$router.push('/login')
//   //   return Promise.reject(response.data)
//   // }
//
//   // app.$message.error({
//   //   showClose: true,
//   //   message: response.data.message || '操作失败: 无法获取更多信息',
//   // });
//   return Promise.reject(response.data);
// },
// (error) => {
//   console.log('');
//   // console.log('response错误：', error.response.data.message);
//   // app.$message.error(`错误：${error.response.data.message}`);
//   return Promise.reject(error);
// });

export const getAction = (url = '', param = {}) => axiosService.axios.get(url, param);
export const postAction = (url = '', data = {}, config = {}) => axiosService.axios.post(url, data, config);
export const putAction = (url = '', data = {}, config = {}) => axiosService.axios.put(url, data, config);
export const deleteAction = (url = '', data = {}, config = {}) => axiosService.axios.delete(url, data, config);
