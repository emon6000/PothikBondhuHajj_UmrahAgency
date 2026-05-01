import React from 'react';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Agents = () => {
  const team = [
    { id: 1, name: "Hafizur Rahman", role: "Chief Hajj Guide (Moallem)", image: "https://randomuser.me/api/portraits/men/32.jpg", phone: "+880 1711 000111" },
    { id: 2, name: "Tariqul Islam", role: "Visa Processing Manager", image: "https://randomuser.me/api/portraits/men/45.jpg", phone: "+880 1722 000222" },
    { id: 3, name: "Fatima Begum", role: "Women's Group Coordinator", image: "https://randomuser.me/api/portraits/women/44.jpg", phone: "+880 1733 000333" },
    { id: 4, name: "Abdullah Al Mahmud", role: "Comilla Branch Head", image: "https://randomuser.me/api/portraits/men/55.jpg", phone: "+880 1744 000444" }
  ];

  return (
    <div className="agents-page">
      <div className="page-banner">
        <h1>Meet Our Dedicated Team</h1>
        <p>Experienced professionals and scholars guiding your spiritual journey.</p>
      </div>

      <div className="agents-grid">
        {team.map(agent => (
          <div className="agent-card" key={agent.id}>
            <img src={agent.image} alt={agent.name} className="agent-photo" />
            <div className="agent-info">
              <h3>{agent.name}</h3>
              <p className="agent-role">{agent.role}</p>
              <div className="agent-contact">
                <p><FaPhoneAlt className="small-icon"/> {agent.phone}</p>
                <p><FaEnvelope className="small-icon"/> info@pothikbondhu.com</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;