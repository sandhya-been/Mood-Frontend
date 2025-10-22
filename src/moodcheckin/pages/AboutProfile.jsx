import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiEdit2Line, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import styles from '../styles/AboutProfile.module.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const { name, email } = userData;
    const nameParts = name ? name.split(' ') : ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    setUser(userData);
    setFormData({
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || ''
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update local storage
      const updatedUserData = {
        ...userData,
        name: data.name,
        email: data.email,
        _id: data._id,
        token: userData.token // Preserve the existing token
      };

      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:5000/api/users/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess('Password updated successfully!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderPasswordInput = (name, label, value) => (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <div className={styles.passwordInput}>
        <input
          type={showPasswords[name] ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handlePasswordChange}
          required
        />
        <button
          type="button"
          className={styles.eyeButton}
          onClick={() => togglePasswordVisibility(name)}
        >
          {showPasswords[name] ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Profile Settings</h1>

        <div className={styles.card}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Account Information</h2>
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(!isEditing)}
              >
                <RiEdit2Line /> {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitButton}>
                  Save Changes
                </button>
              </form>
            ) : (
              <div className={styles.info}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Password</h2>
              <button 
                className={styles.editButton}
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                <RiLockLine /> {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handleUpdatePassword}>
                {renderPasswordInput('currentPassword', 'Current Password', passwordData.currentPassword)}
                {renderPasswordInput('newPassword', 'New Password', passwordData.newPassword)}
                {renderPasswordInput('confirmPassword', 'Confirm New Password', passwordData.confirmPassword)}
                <button type="submit" className={styles.submitButton}>
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;