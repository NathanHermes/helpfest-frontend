import axios from 'axios';

const api = axios.create({
  baseURL: 'http://26.134.180.105:3333',  
})

export default api;