import React, { useState } from 'react';
import { getCurrentUserId, changePassword } from '../utils/auth';

export default function Account() {
  const username = getCurrentUserId();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!newPassword) { setError('New password is required'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    try {
      changePassword(username, currentPassword, newPassword);
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-xl font-bold mb-2">Account</h2>
        <p className="text-sm">Signed in as: <span className="font-mono">{username}</span></p>
      </div>

      <div className="p-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        {message && <div className="mb-3 p-3 border-2 rounded" style={{ borderColor: '#16a34a', color: '#166534' }}>{message}</div>}
        {error && <div className="mb-3 p-3 border-2 rounded" style={{ borderColor: '#f87171', color: '#b91c1c' }}>{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border-2 rounded-lg"
            style={{ borderColor: 'var(--border-color)' }}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border-2 rounded-lg"
            style={{ borderColor: 'var(--border-color)' }}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-3 border-2 rounded-lg"
            style={{ borderColor: 'var(--border-color)' }}
          />
          <button type="submit" className="py-3 px-4 border-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}



