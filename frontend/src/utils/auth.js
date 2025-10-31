export const CURRENT_USER_KEY = 'studybuddy_current_user';
const USERS_KEY = 'studybuddy_users';

export function getCurrentUserId() {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch (_e) {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUserId());
}

export function login(userId) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, String(userId));
  } catch (_e) {
    // ignore
  }
}

export function logout() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (_e) {
    // ignore
  }
}

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_e) {
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (_e) {
    // ignore
  }
}

export function createAccount(username, password) {
  const users = getUsers();
  const key = String(username).trim().toLowerCase();
  if (!key) throw new Error('Username is required');
  if (users[key]) throw new Error('Account already exists');
  users[key] = { username: key, password: String(password) };
  saveUsers(users);
  login(key);
  return key;
}

export function loginWithPassword(username, password) {
  const users = getUsers();
  const key = String(username).trim().toLowerCase();
  const user = users[key];
  if (!user) throw new Error('Account not found');
  if (String(password) !== user.password) throw new Error('Invalid password');
  login(key);
  return key;
}

export function changePassword(username, currentPassword, newPassword) {
  const users = getUsers();
  const key = String(username).trim().toLowerCase();
  const user = users[key];
  if (!user) throw new Error('Account not found');
  if (String(currentPassword) !== user.password) throw new Error('Current password is incorrect');
  users[key].password = String(newPassword);
  saveUsers(users);
}


