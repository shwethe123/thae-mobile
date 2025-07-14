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