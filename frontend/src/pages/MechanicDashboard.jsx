import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function MechanicDashboard() {
  const [bookings, setBookings] = useState([]);

  const load = async () => {
    const { data } = await api.get('/api/mechanic/bookings');
    setBookings(data);
  };

  useEffect(() => { load(); }, []);

  const update = async (id, action) => {
    await api.post(`/api/mechanic/bookings/${id}/${action}`);
    await load();
  };

  return (
    <div className="container">
      <h2>Mechanic Dashboard</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {b.description} - {b.status}
            {b.status === 'PENDING' && (
              <>
                <button onClick={() => update(b.id, 'accept')}>Accept</button>
                <button onClick={() => update(b.id, 'reject')}>Reject</button>
              </>
            )}
            {b.status === 'ACCEPTED' && (
              <button onClick={() => update(b.id, 'complete')}>Mark Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
