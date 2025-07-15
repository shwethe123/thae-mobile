// lib/jobsApi.js
const API_BASE_URL = 'http://192.168.16.32:8080'; 

export const fetchAllJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dummy`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return []; 
  }
};

export const updateJobStatus = async (id, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/dummy/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // In the future, you would add your auth token here
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) {
      // Try to get error message from backend response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json(); // Return the success message from the backend
  } catch (error) {
    console.error(`Failed to update job status for id ${id}:`, error);
    // Re-throw the error so the component can catch it and show an alert
    throw error;
  }
};