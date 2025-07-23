import axios from 'axios';

const baseURL = __DEV__
  ? 'http://localhost:1337'
  : 'https://aricles.example.com';

const client = axios.create({
  baseURL,
});

export default client;
