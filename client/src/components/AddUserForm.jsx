import React, { useState } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function AddUserForm({ onUserAdded }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    nic: '',
    password: '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setProfilePic(e.target.files[0] || null);
  };

  const validate = () => {
    const errs = {};
    if (!form.id) errs.id = 'Please enter ID';
    if (!form.name) errs.name = 'Please enter Name';
    if (!form.email) errs.email = 'Please enter Email';
    if (!form.phoneNumber) errs.phoneNumber = 'Please enter Phone Number';
    if (!form.nic) errs.nic = 'Please enter NIC';
    if (!form.password) errs.password = 'Please enter Password';
    return errs;
  };

  const onSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      let profilePicUrl = '';
      if (profilePic) {
        profilePicUrl = await uploadToCloudinary(profilePic);
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, profilePic: profilePicUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('User added!');
        setForm({ id: '', name: '', email: '', phoneNumber: '', nic: '', password: '' });
        setProfilePic(null);
        setErrors({});
        if (onUserAdded) onUserAdded(data.user);
      } else {
        alert(data.message || 'Failed to add user');
      }
    } catch (err) {
      alert('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 12px #e6f7ff' }}>
      <h2>Add New User</h2>
      <form onSubmit={onSubmit} autoComplete="off">
        <div style={{ marginBottom: 16 }}>
          <label>ID *</label><br />
          <input name="id" value={form.id} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.id && <div style={{ color: 'red' }}>{errors.id}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Name *</label><br />
          <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email *</label><br />
          <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Phone Number *</label><br />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.phoneNumber && <div style={{ color: 'red' }}>{errors.phoneNumber}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>NIC *</label><br />
          <input name="nic" value={form.nic} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.nic && <div style={{ color: 'red' }}>{errors.nic}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password *</label><br />
          <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Profile Photo</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {profilePic && <div style={{ marginTop: 8 }}>{profilePic.name}</div>}
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 24px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4 }}>
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
} 