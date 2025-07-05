// utils/api.js
export const getAttractions = async () => {
  const res = await fetch('http://192.168.16.32:5000/api/attractions');
  return await res.json();
};
