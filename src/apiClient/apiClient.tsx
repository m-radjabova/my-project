import axios  from 'axios';

const apiClient = axios.create({
  baseURL: "your urls",
});

export default apiClient;