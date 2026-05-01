import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import heroBg from '../assets/hero-background.jpg';
import trustedFaces from '../assets/trusted-faces.png';

const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Hero = () => {
  const navigate = useNavigate();

  const branches = [
    { id: 1, name: "Dhaka HQ", pos: [23.8103, 90.4125] },
    { id: 2, name: "Comilla Branch", pos: [23.4607, 91.1809] },
    { id: 3, name: "Chittagong Branch", pos: [22.3569, 91.7832] }
  ];

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay">
        
        <div className="hero-content-wrapper">
          <div className="hero-container">
            
            <div className="hero-left">
              <h1 className="hero-title">Best Hajj and Umrah Agency in Bangladesh</h1>
              <p className="hero-description">
                Embracing the journey of a lifetime with Pothik Bondhu. We provide holistic 
                support and expert guidance to ensure your pilgrimage is peaceful and spiritual.
              </p>
              
              <div className="trusted-faces-container">
                <img src={trustedFaces} alt="Our Experts" className="trusted-faces-img" />
                <span className="trusted-text">Guided by trusted scholars & experts</span>
              </div>

              <div className="hero-btns">
                <button className="book-now-btn" onClick={() => navigate('/packages')}>
                  Book Now
                </button>
                <div className="play-video">
                  <div className="play-icon">▶</div>
                  <span>Experience More</span>
                </div>
              </div>
            </div>

            {/* Right Side: Map */}
            {/* Right Side: Map */}
            <div className="hero-right" onClick={() => navigate('/contact')}>
              <div className="map-wrapper">
                
                {/* ADD THIS NEW LINE HERE */}
                <div className="map-title">📍 Where to Find Us</div>

                <MapContainer center={[23.6850, 90.3563]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {branches.map(branch => (
                    <Marker key={branch.id} position={branch.pos}>
                      <Popup>{branch.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
                <div className="map-hint">Tap to Contact Us</div>
              </div>
            </div>
          </div>

          {/* Bottom Layer: Social Proof Stats */}
          <div className="stats-container">
            <div className="stat-card"><h2>700+</h2><p>HAJJ TRAVELER</p></div>
            <div className="stat-card"><h2>2.2K+</h2><p>UMRAH TRAVELER</p></div>
            <div className="stat-card"><h2>99%</h2><p>SATISFIED PILGRIMS</p></div>
            <div className="stat-card"><h2>7+</h2><p>YEARS EXPERIENCE</p></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;