const API_BASE_URL = 'http://localhost:3000';

export const api = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return response.json();
  },

  getFamily: async () => {
    const response = await fetch(`${API_BASE_URL}/api/family`);
    if (!response.ok) {
      throw new Error('Failed to fetch family');
    }
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return response.json();
  },

  getActivity: async () => {
    const response = await fetch(`${API_BASE_URL}/api/activity`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    return response.json();
  },

  getSales: async () => {
    const response = await fetch(`${API_BASE_URL}/api/sales`);
    if (!response.ok) {
      throw new Error('Failed to fetch sales');
    }
    return response.json();
  }
};
