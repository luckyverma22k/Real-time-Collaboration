import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/login', form);
    localStorage.setItem('token', res.data.token);
    window.location.href = '/editor/mydoc';
  };

  return (
    <div>
      <h2>Login</h2>
      <input onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input type="password" onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
