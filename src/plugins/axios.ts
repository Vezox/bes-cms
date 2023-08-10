import axios from "axios";
import { useCookies } from "vue3-cookies";
import { router } from "../router"
const { cookies } = useCookies();


const axiosApi = axios.create({
  baseURL: "https://api.besgroup.asia/api",

  // baseURL: "http://localhost:3100/api",
});

enum MessageError {
  INVALID_TOKEN = <any>'invalid token'
}

axiosApi.interceptors.request.use((config: any) => {
  const token = cookies.get("token")
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
});

axiosApi.interceptors.response.use(response => response, error => {
  if (error.response?.data?.message == MessageError.INVALID_TOKEN) {
    router.push('/signin')
  }
  return Promise.reject(error); 
});


export const setAuthHeader = () => {
  const token = cookies.get("token")
  if (token) {
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

setAuthHeader()

export default axiosApi;
