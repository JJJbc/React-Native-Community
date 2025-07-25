import axios from 'axios';

const baseURL = __DEV__
  ? 'http://10.0.2.2:1337'
  : 'https://aricles.example.com';

const client = axios.create({
  baseURL,
});

export function applyToken(jwt: string) {
  client.defaults.headers.Authorization = `Bearer ${jwt}`;
}

export function clearToken() {
  delete client.defaults.headers.Authorization;
}

export default client;
