import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleRegister = async () => {
    await axios.post('http://localhost:5000/api/auth/register', form);
    alert('Registered! Now login.');
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Register</h2>
      <input onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input type="password" onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
