import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaBus,
  FaCheckCircle,
  FaHotel,
  FaIdBadge,
  FaPlane,
  FaUtensils,
} from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        const foundPackage = data.find((p) => p.id === id);
        setPkg(foundPackage);
      } catch (err) {
        console.error('Error fetching package details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackageDetails();
  }, [id]);

  // Smart dynamic itinerary generator based on package duration text
  const generateItinerary = (durationStr, type, features) => {
    if (!durationStr) {
      return [
        { day: 'Day 1', desc: 'Departure from Dhaka to Jeddah and transfer to hotel.' },
        { day: 'Final Day', desc: 'Check-out and airport transfer for return flight to Dhaka.' }
      ];
    }

    // Extract numbers from duration string (e.g., "14 Days" -> 14)
    const match = durationStr.match(/\d+/);
    const totalDays = match ? parseInt(match[0], 10) : 7;

    if (totalDays <= 7) {
      return [
        { day: 'Day 1', desc: 'Departure from Dhaka (Hazrat Shahjalal International Airport) to Jeddah/Madinah. Hotel check-in.' },
        { day: `Day 2-${totalDays - 1}`, desc: `Perform Umrah with experienced Moallem. Dedicated time for prayers at Masjid al-Haram / Al-Masjid an-Nabawi. ${features || ''}` },
        { day: `Day ${totalDays}`, desc: 'Final prayers, hotel check-out, and transfer to airport for return flight to Dhaka.' }
      ];
    } else if (totalDays <= 20) {
      return [
        { day: 'Day 1', desc: 'Departure from Dhaka to KSA. Arrival and transfer to Makkah hotel.' },
        { day: `Day 2-${Math.floor(totalDays / 2)}`, desc: 'Perform Umrah, guided Ziyarah of historical sites in Makkah (Jabal al-Nour, Cave of Hira, etc.).' },
        { day: `${Math.floor(totalDays / 2) + 1}-${totalDays - 1}`, desc: 'Transfer to Madinah. Prayers at Al-Masjid an-Nabawi and visit Rawdah Sharif.' },
        { day: `Day ${totalDays}`, desc: 'Farewell tawaf (if applicable), check-out, and airport transfer back to Dhaka.' }
      ];
    } else {
      // For long Hajj packages (e.g., 40 Days)
      const isHajj = type?.toLowerCase().includes('hajj');
      return [
        { day: 'Day 1-5', desc: 'Arrival in KSA, initial settling in Makkah hotel, and performance of Umrah.' },
        { day: 'Day 6-10', desc: isHajj ? 'Preparation for Hajj rites, spiritual sessions, and lectures by scholars.' : 'Extended stay with daily prayers and local Ziyarah tours.' },
        { day: isHajj ? 'Day 11-15' : 'Day 11-middle', desc: isHajj ? 'The Holy Rituals: Moving to Mina, Arafat (Wuquf), Muzdalifah, and Rami (stoning of Jamarat).' : 'Continuous worship, tahajjud, and spiritual reflections in the holy sanctuaries.' },
        { day: `Day ${totalDays - 5}-${totalDays - 1}`, desc: 'Madinah phase: Staying near Masjid an-Nabawi, visiting historical mosques and graveyard of Baqi.' },
        { day: `Day ${totalDays}`, desc: 'Final departure from Jeddah/Madinah airport back to Dhaka.' }
      ];
    }
  };

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', color: '#064e3b', fontWeight: 'bold' }}>Loading package details...</div>;
  }

  if (!pkg) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>Package not found</h2>
        <button onClick={() => navigate('/packages')} style={{ marginTop: '15px', padding: '10px 20px', background: '#064e3b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to Packages</button>
      </div>
    );
  }

  const dynamicItinerary = generateItinerary(pkg.duration, pkg.type, pkg.features);

  return (
    <>
      {/* INTERNAL CSS FOR MOBILE RESPONSIVENESS */}
      <style>{`
        @media (max-width: 768px) {
          .package-details-page {
            padding: 10px !important;
          }
          
          .details-top-bar {
            padding: 10px 0 !important;
          }

          /* Stack Hero Section */
          .details-hero {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            background: white;
            padding: 15px !important;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          }

          .details-hero-image {
            width: 100% !important;
            height: 200px !important;
            overflow: hidden;
            border-radius: 8px;
            position: relative;
          }

          .details-hero-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .details-hero-info {
            width: 100% !important;
            padding: 0 !important;
          }

          .details-hero-info h1 {
            font-size: 1.4rem !important;
            line-height: 1.2 !important;
            margin-bottom: 8px !important;
          }

          .details-duration {
            font-size: 0.9rem !important;
            margin-bottom: 12px !important;
          }

          .details-price-box {
            padding: 12px !important;
            margin-bottom: 15px !important;
          }

          .price-amount {
            font-size: 1.6rem !important;
          }

          .book-now-large-btn {
            width: 100% !important;
            display: block !important;
            text-align: center !important;
            padding: 14px !important;
            font-size: 1rem !important;
            box-sizing: border-box;
          }

          /* Stack Content Grid */
          .details-content-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            margin-top: 20px !important;
          }

          .info-section {
            background: white;
            padding: 15px !important;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            margin-bottom: 0 !important;
          }

          .info-section h3 {
            font-size: 1.1rem !important;
            margin-bottom: 12px !important;
          }

          /* Inclusions grid 2 columns on mobile */
          .inclusions-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }

          .inclusion-item {
            font-size: 0.85rem !important;
            gap: 8px !important;
          }

          .itinerary-list li {
            font-size: 0.85rem !important;
            margin-bottom: 10px !important;
            line-height: 1.4 !important;
          }

          /* Sidebar boxes */
          .details-sidebar {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .sidebar-card, .sidebar-contact {
            background: white;
            padding: 15px !important;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          }

          .sidebar-card h3 {
            font-size: 1.1rem !important;
          }

          .notes-list li {
            font-size: 0.85rem !important;
          }

          .sidebar-contact h4 {
            font-size: 1.1rem !important;
          }

          .sidebar-contact p {
            font-size: 0.85rem !important;
          }

          .contact-number {
            font-size: 1.1rem !important;
          }
        }
      `}</style>

      <div className="package-details-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="details-top-bar" style={{ padding: '0 0 20px 0' }}>
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#064e3b',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            <FaArrowLeft /> Back to Packages
          </button>
        </div>

        <div className="details-hero" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', alignItems: 'center' }}>
          <div className="details-hero-image" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '320px' }}>
            <img
              src={pkg.image || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200'}
              alt={pkg.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="type-badge" style={{ position: 'absolute', top: '15px', left: '15px', background: '#064e3b', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {pkg.type}
            </div>
          </div>

          <div className="details-hero-info">
            <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '10px' }}>{pkg.title}</h1>
            <p className="details-duration" style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1rem' }}>
              Total Duration: <strong style={{ color: '#064e3b' }}>{pkg.duration}</strong>
            </p>
            <div className="details-price-box" style={{ background: '#f8fafc', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <span className="price-label" style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Starting from</span>
              <h2 className="price-amount" style={{ margin: '4px 0', fontSize: '2.2rem', color: '#16a34a' }}>
                {pkg.cost ? Number(pkg.cost).toLocaleString() : '0'} <span style={{ fontSize: '1rem', color: '#64748b' }}>BDT</span>
              </h2>
              <span className="price-suffix" style={{ fontSize: '0.8rem', color: '#64748b' }}>/ Per Person</span>
            </div>

            <Link to="/register" state={{ selectedPackageId: pkg.id }} className="book-now-large-btn" style={{ display: 'inline-block', background: '#064e3b', color: 'white', padding: '14px 30px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 15px rgba(6,78,59,0.2)' }}>
              Proceed to Pre-Registration
            </Link>
            <p className="guarantee-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', marginTop: '12px', fontSize: '0.9rem', fontWeight: '500' }}>
              <FaCheckCircle /> Authorized Hajj & Umrah Agency
            </p>
          </div>
        </div>

        <div className="details-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
          <div className="details-main-content">
            <section className="info-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '1.25rem' }}>Package Inclusions</h3>
              <div className="inclusions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaPlane style={{ color: '#064e3b' }} /> <span>Return Air Ticket</span>
                </div>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaIdBadge style={{ color: '#064e3b' }} /> <span>Visa Processing</span>
                </div>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaHotel style={{ color: '#064e3b' }} /> <span>Star Rated Hotels</span>
                </div>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaBus style={{ color: '#064e3b' }} /> <span>AC Transport in KSA</span>
                </div>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaUtensils style={{ color: '#064e3b' }} /> <span>Daily Meals (Buffet)</span>
                </div>
                <div className="inclusion-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontWeight: '500' }}>
                  <FaCheckCircle style={{ color: '#064e3b' }} /> <span>Guided Ziyarah</span>
                </div>
              </div>
            </section>

            <section className="info-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '1.25rem' }}>Sample Itinerary Overview ({pkg.duration})</h3>
              <ul className="itinerary-list" style={{ paddingLeft: '20px', color: '#475569' }}>
                {dynamicItinerary.map((item, index) => (
                  <li key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                    <strong style={{ color: '#064e3b' }}>{item.day}:</strong> {item.desc}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="details-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div className="sidebar-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem' }}>Important Notes</h3>
              <ul className="notes-list" style={{ paddingLeft: '18px', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <li style={{ marginBottom: '8px' }}>Prices are subject to change based on airline ticket availability.</li>
                <li style={{ marginBottom: '8px' }}>Hotel distances are calculated from the outer courtyard of the Harams.</li>
                <li>Please ensure your passport is valid for at least 6 months.</li>
              </ul>
            </div>

            <div className="sidebar-contact" style={{ background: '#064e3b', color: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(6,78,59,0.15)' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#fde047' }}>Need Customization?</h4>
              <p style={{ fontSize: '0.9rem', opacity: '0.9', marginBottom: '15px', lineHeight: '1.4' }}>Call our branch for a customized itinerary tailored to your family's needs.</p>
              <p className="contact-number" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: 'white' }}>+880 1733 391 826</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageDetails;