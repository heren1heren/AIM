import axios from "axios";

const api = axios.create({
    baseURL: "https://your-backend-url.com/api",
    withCredentials: true,
});

// Optional: attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Optional: handle 401 errors globally
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
