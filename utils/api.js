// ✅ FIXED version of api.js
export const fetchWithToken = async (token, url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`http://192.168.16.32:5000${url}`, options);
  return res.json();
};
