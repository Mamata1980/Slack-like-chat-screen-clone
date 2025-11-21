import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const fetchMessages = () => axios.get(`${BASE}/api/messages`).then(r => r.data);
export default {
  fetchMessages
};
