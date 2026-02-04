// import axios from "axios";

// const apiClient = axios.create({
//   baseURL: "http://127.0.0.1:8000",
//   headers: { "Content-Type": "application/json" },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default apiClient;


import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.location.href = "/login"; 
        return Promise.reject(error);
      }

      try {
        const r = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refreshToken: refresh,
        });

        localStorage.setItem("accessToken", r.data.accessToken);

        original.headers.Authorization = `Bearer ${r.data.accessToken}`;
        return apiClient(original); 
      } catch (e) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
