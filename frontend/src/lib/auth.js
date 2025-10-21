export function saveAuth({ token, role, fullName, userId }) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('fullName', fullName);
  localStorage.setItem('userId', String(userId));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('fullName');
  localStorage.removeItem('userId');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}
