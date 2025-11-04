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
  },

  toggleFamilyMemberStar: async (memberId) => {
    const response = await fetch(`${API_BASE_URL}/api/family/${memberId}/star`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle star status');
    }
    return response.json();
  },

  addFamilyMember: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/family`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to add family member');
    }
    return response.json();
  },

  getContracts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/contracts`);
    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }
    return response.json();
  },

  deleteFamilyMember: async (memberId) => {
    const response = await fetch(`${API_BASE_URL}/api/family/${memberId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete family member');
    }
    return response.json();
  },

  assignNextOfKin: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/family/next-of-kin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to assign next of kin');
    }
    return response.json();
  },

  updateMemberAccesses: async (memberId, contracts) => {
    const response = await fetch(`${API_BASE_URL}/api/family/${memberId}/accesses`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contracts }),
    });
    if (!response.ok) {
      throw new Error('Failed to update member accesses');
    }
    return response.json();
  },

  getBalance: async () => {
    const response = await fetch(`${API_BASE_URL}/api/balance`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    return response.json();
  },

  getWallet: async () => {
    const response = await fetch(`${API_BASE_URL}/api/wallet`);
    if (!response.ok) {
      throw new Error('Failed to fetch wallet');
    }
    return response.json();
  },

  getCemetery: async () => {
    const response = await fetch(`${API_BASE_URL}/api/cemetery`);
    if (!response.ok) {
      throw new Error('Failed to fetch cemetery');
    }
    return response.json();
  },

  getFuneral: async () => {
    const response = await fetch(`${API_BASE_URL}/api/funeral`);
    if (!response.ok) {
      throw new Error('Failed to fetch funeral');
    }
    return response.json();
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    return response.json();
  },

  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/api/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  },

  getDocumentUrl: (documentId) => {
    return `${API_BASE_URL}/api/documents/${documentId}`;
  },

  getDocumentDownloadUrl: (documentId) => {
    return `${API_BASE_URL}/api/documents/${documentId}/download`;
  },

  addPaymentMethod: async (type, formData) => {
    const response = await fetch(`${API_BASE_URL}/api/wallet/payment-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, formData }),
    });
    if (!response.ok) {
      throw new Error('Failed to add payment method');
    }
    return response.json();
  },
};
