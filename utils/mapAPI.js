// utils/mapAPI.js
export const getAttractions = async () => {
  const res = await fetch('https://h-submit-backend-shwethe.onrender.com/api/attractions');
  if (!res.ok) {
    throw new Error('Failed to fetch attractions');
  }
  return await res.json();
};
