import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingMechs, setPendingMechs] = useState([]);
  const [stats, setStats] = useState({});

  const load = async () => {
    const [u, m, s] = await Promise.all([
      api.get('/api/admin/users'),
      api.get('/api/admin/mechanics/pending'),
      api.get('/api/admin/stats'),
    ]);
    setUsers(u.data);
    setPendingMechs(m.data);
    setStats(s.data);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await api.post(`/api/admin/mechanics/${id}/approve`);
    await load();
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div>
        <strong>Stats:</strong> Users: {stats.totalUsers} | Mechanics: {stats.totalMechanics} | Bookings: {stats.totalBookings}
      </div>
      <h3>Pending Mechanics</h3>
      <ul>
        {pendingMechs.map((m) => (
          <li key={m.id}>
            {m.user.fullName} - {m.city} {m.pincode}
            <button onClick={() => approve(m.id)}>Approve</button>
          </li>
        ))}
      </ul>
      <h3>All Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.fullName} - {u.role} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}
