import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Validation
    if (!currentPassword) {
      setError('Current password is required');
      setLoading(false);
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (!newUsername && !newPassword) {
      setError('Please provide either a new username or new password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Profile updated successfully! Redirecting...');
        // Clear form
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
        setConfirmNewPassword('');

        // Redirect after success
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Update your username and/or password
      </p>

      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label>New Username (optional):</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder={`Current: ${user?.username || 'Not set'}`}
          />
        </div>

        <div>
          <label>New Password (optional):</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={!newPassword}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.6rem',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
