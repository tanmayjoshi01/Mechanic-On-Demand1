import { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', city: '', pincode: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Full Name" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
        <input placeholder="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setField('password', e.target.value)} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
        <input placeholder="City" value={form.city} onChange={(e) => setField('city', e.target.value)} />
        <input placeholder="Pincode" value={form.pincode} onChange={(e) => setField('pincode', e.target.value)} />
        <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
          <option value="CUSTOMER">Customer</option>
          <option value="MECHANIC">Mechanic</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
