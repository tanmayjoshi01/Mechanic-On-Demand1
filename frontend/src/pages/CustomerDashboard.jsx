import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function CustomerDashboard() {
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [desc, setDesc] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [info, setInfo] = useState('');

  const searchByCity = async () => {
    const { data } = await api.get(`/api/customer/mechanics/city/${city}`);
    setMechanics(data);
  };
  const searchByPincode = async () => {
    const { data } = await api.get(`/api/customer/mechanics/pincode/${pincode}`);
    setMechanics(data);
  };

  const book = async () => {
    if (!selectedMechanic) return;
    const { data } = await api.post('/api/customer/bookings', {
      mechanicId: selectedMechanic.user.id,
      description: desc,
      city: selectedMechanic.city,
      pincode: selectedMechanic.pincode,
    });
    setInfo(`Booking created with ID ${data.id}`);
  };

  return (
    <div className="container">
      <h2>Customer Dashboard</h2>
      <div>
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <button onClick={searchByCity}>Search by City</button>
      </div>
      <div>
        <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        <button onClick={searchByPincode}>Search by Pincode</button>
      </div>
      <ul>
        {mechanics.map((m) => (
          <li key={m.id}>
            <label>
              <input type="radio" name="mech" onChange={() => setSelectedMechanic(m)} />
              {m.user.fullName} - {m.skills} - {m.city} {m.pincode}
            </label>
          </li>
        ))}
      </ul>
      <textarea placeholder="Problem description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <button onClick={book}>Book Selected Mechanic</button>
      {info && <p>{info}</p>}
    </div>
  );
}
