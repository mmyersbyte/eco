import axios from 'axios';

// Configuração do base URL usando variável de ambiente Expo
const baseURL = 'http://192.168.1.17:3333';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
