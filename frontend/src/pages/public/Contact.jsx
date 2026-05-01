import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL for map rendering
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

// Fixing default Leaflet icon paths in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Contact = () => {
  // Branch Coordinates for the Leaflet Map
  const branches = [
    { id: 1, name: "Dhaka HQ", pos: [23.7330, 90.4172], address: "32 Purana Paltan, Sultan Ahmed Plaza, Suite-1202" },
    { id: 2, name: "Comilla Branch", pos: [23.4607, 91.1809], address: "University Road, Kotbari, Comilla" },
    { id: 3, name: "Chittagong Office", pos: [22.3569, 91.7832], address: "Agrabad Commercial Area, Chittagong" }
  ];

  return (
    <div className="contact-page">
      <div className="page-banner">
        <h1>Get In Touch</h1>
        <p>Visit our branches or send us a message online.</p>
      </div>

      <div className="contact-container">
        
        {/* Left Side: Contact Form & Branch Details */}
        <div className="contact-info-side">
          <div className="branch-list">
            <h3>Our Locations</h3>
            {branches.map(branch => (
              <div className="branch-detail-card" key={branch.id}>
                <h4><FaMapMarkerAlt className="text-emerald" /> {branch.name}</h4>
                <p>{branch.address}</p>
                <p><FaPhoneAlt className="text-emerald" /> +880 1733 391 826</p>
              </div>
            ))}
          </div>

          <div className="message-form-box">
            <h3>Send us a Message</h3>
            <form className="message-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="How can we help you?" rows="4" required></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>

        {/* Right Side: Leaflet Interactive Map */}
        <div className="contact-map-side">
          <MapContainer 
            center={[23.6850, 90.3563]} 
            zoom={7} 
            scrollWheelZoom={false} 
            className="leaflet-map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render markers dynamically from our array */}
            {branches.map(branch => (
              <Marker key={branch.id} position={branch.pos}>
                <Popup>
                  <strong>{branch.name}</strong><br/>
                  {branch.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default Contact;