import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '', // Leave blank for proxying through Next.js /api
  withCredentials: true,
});

// Helper to delete cookies on the client
function deleteCookie(name: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}

// Safe redirect
function safeRedirect(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
}

// Axios response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

      // Clear client-side cookies and storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        localStorage.removeItem('admin');

        deleteCookie('token');
        deleteCookie('admin_token');

        if (pathname.startsWith('/admin')) {
          safeRedirect('/login');
        } else {
          safeRedirect('/signin');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
