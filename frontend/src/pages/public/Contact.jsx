import React, { useState } from 'react';
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
  // 1. State for handling the Formspree submission feedback
  const [formStatus, setFormStatus] = useState('');

  // 2. Branch Coordinates based on the Pothik Bondhu map image
  const branches = [
    { id: 1, name: "Dinajpur Branch", pos: [25.6221, 88.6438], address: "Station Road, Dinajpur" },
    { id: 2, name: "Netrokona Branch", pos: [24.8835, 90.7270], address: "Main Town Road, Netrokona" },
    { id: 3, name: "Sreemangal Branch", pos: [24.3065, 91.7296], address: "Tea Estate Road, Sreemangal" },
    { id: 4, name: "Paharpur Branch", pos: [25.0298, 88.9806], address: "Museum Road, Paharpur, Naogaon" },
    { id: 5, name: "Savar Branch", pos: [23.8479, 90.2580], address: "Savar Bus Stand, Dhaka" },
    { id: 6, name: "Bagerhat Branch", pos: [22.6602, 89.7895], address: "Mosque City Road, Bagerhat" },
    { id: 7, name: "Kuakata Branch", pos: [21.8167, 90.1167], address: "Sea Beach Road, Kuakata" },
    { id: 8, name: "Cox's Bazar Branch", pos: [21.4272, 92.0058], address: "Kolatoli Road, Cox's Bazar" }
  ];

  // 3. Formspree API Submission Logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xnjwzylb', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setFormStatus('success');
        form.reset(); // Clear the form on success
        setTimeout(() => setFormStatus(''), 5000); // Hide the success message after 5 seconds
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

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
            <div className="branch-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {branches.map(branch => (
                <div className="branch-detail-card" key={branch.id}>
                  <h4><FaMapMarkerAlt className="text-emerald" /> {branch.name}</h4>
                  <p>{branch.address}</p>
                  <p><FaPhoneAlt className="text-emerald" /> +880 1733 391 826</p>
                </div>
              ))}
            </div>
          </div>

          <div className="message-form-box">
            <h3>Send us a Message</h3>
            
            <form className="message-form" onSubmit={handleFormSubmit}>
              {/* Formspree requires the 'name' attributes on inputs */}
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="How can we help you?" rows="4" required></textarea>
              
              <button type="submit" className="submit-btn" disabled={formStatus === 'sending'}>
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
              
              {/* Success/Error Feedback Messages */}
              {formStatus === 'success' && (
                <p style={{ color: '#064e3b', fontWeight: 'bold', marginTop: '10px' }}>
                  Message sent successfully! We will contact you soon.
                </p>
              )}
              {formStatus === 'error' && (
                <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
                  Oops! There was a problem sending your message.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Leaflet Interactive Map */}
        <div className="contact-map-side">
          <MapContainer 
            center={[23.6850, 90.3563]} 
            zoom={6.5} 
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