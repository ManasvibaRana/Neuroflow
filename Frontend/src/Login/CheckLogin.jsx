
export function isLoggedIn() {
   return sessionStorage.getItem('token') !== null;
}

export function logout() {
  sessionStorage.removeItem('token');
}
