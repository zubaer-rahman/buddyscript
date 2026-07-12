import axios from "axios";
import { BASE_URL } from "./api/config";
import { attachAuthInterceptor } from "./api/authInterceptor";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

attachAuthInterceptor(api);

export default api;
