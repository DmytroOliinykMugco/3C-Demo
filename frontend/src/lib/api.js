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

  uploadPhoto: async (photoUrl) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoUrl }),
    });
    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
    return response.json();
  },

  getFamily: async () => {
    const response = await fetch(`${API_BASE_URL}/api/family`);
    if (!response.ok) {
      throw new Error('Failed to fetch family');
    }
    return response.json();
  }
};
