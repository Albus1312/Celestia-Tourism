const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = VITE_API_URL.endsWith('/api') 
  ? VITE_API_URL 
  : (VITE_API_URL.endsWith('/') ? `${VITE_API_URL}api` : `${VITE_API_URL}/api`);

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('celestia_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API ERROR] ${endpoint}:`, error);
    throw error;
  }
}

async function uploadFile(endpoint, file) {
  const token = localStorage.getItem('celestia_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[UPLOAD ERROR] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth Operations
  auth: {
    login: (username, password) => 
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      }),
    register: (registerData) => 
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(registerData)
      }),
    logout: () => 
      request('/auth/logout', {
        method: 'POST'
      }),
  },

  // Destinations Engine
  destinations: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.category) query.append('category', params.category);
      if (params.region) query.append('region', params.region);
      if (params.province) query.append('province', params.province);
      
      const queryString = query.toString();
      return request(`/destinations${queryString ? `?${queryString}` : ''}`);
    },
    
    get: (idOrSlug) => request(`/destinations/${idOrSlug}`),
    
    create: (data) => request('/destinations', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

    update: (id, data) => request(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

    delete: (id) => request(`/destinations/${id}`, {
      method: 'DELETE'
    }),
    
    addReview: (id, reviewData) => 
      request(`/destinations/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      }),
      
    getMetadata: () => request('/destinations/meta'),
  },

  // Landing Page Configuration (Visual Builder)
  landingPage: {
    getConfig: (destinationId) => request(`/landingpage/${destinationId}`),
    
    saveConfig: (destinationId, configData) => 
      request(`/landingpage/${destinationId}`, {
        method: 'POST',
        body: JSON.stringify(configData)
      }),
      
    getThemes: () => request('/landingpage/themes'),
  },

  // Analytics
  analytics: {
    getOverview: () => request('/analytics/overview'),
  },
  
  // Health check
  getHealth: () => request('/health').catch(() => ({ status: "Offline" })),

  // Users
  users: {
    getAll: (params) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.append('search', params.search);
      if (params?.page) qs.append('page', params.page);
      if (params?.limit) qs.append('limit', params.limit);
      return request(`/users?${qs.toString()}`);
    },
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },

  // File Upload
  upload: {
    image: (file) => uploadFile('/upload/image', file),
  }
};
