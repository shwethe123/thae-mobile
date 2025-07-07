const API_BASE_URL = 'https://h-submit-backend-shwethe.onrender.com/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ msg: 'An unknown error occurred' }));
    const error = new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const getAttractions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attractions`);
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch attractions:', error);
    throw error;
  }
};

export const getAttractionById = async (id) => {
    if (!id) throw new Error("Attraction ID is required.");
    try {
      const response = await fetch(`${API_BASE_URL}/attractions/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch attraction with ID ${id}:`, error);
      throw error;
    }
};

export const incrementViewCount = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/attractions/${id}/view`, {
            method: 'POST',
        });
    } catch (error) {
        // This is a background task, so we don't need to throw an error to the user
        console.warn('Failed to increment view count:', error);
    }
};

// Add other API functions like 'createAttraction' here