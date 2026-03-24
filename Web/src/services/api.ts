import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // handle logout or refresh
        }
        return Promise.reject(err);
    }
);

export default api;
