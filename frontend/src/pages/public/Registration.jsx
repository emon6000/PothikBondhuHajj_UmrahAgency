import { useEffect, useState } from 'react';
import { FaCheckCircle, FaEnvelope, FaIdCard, FaPassport, FaPhone, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import packagesData from '../../data/packages.json';

const Registration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [journeyType, setJourneyType] = useState('hajj');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nid: '', passport: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [user, setUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('pothik_user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const filteredPackages = packagesData.filter((p) => p.type === journeyType);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkg) return alert(t('registration.selectAlert'));

    try {
      if (user) {
        const response = await fetch(`${API_URL}/api/create-booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, packageId: selectedPkg.id }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`Success! ${data.message}`);
          navigate('/client-dashboard');
        } else alert(`Error: ${data.error}`);
      } else {
        const response = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, password: formData.phone, packageId: selectedPkg.id }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(t('registration.successAlert'));
          navigate('/');
        } else {
          alert(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert(t('registration.connectError'));
    }
  };

  return (
    <div className="reg-page-container">
      <h2>{t('registration.title')}</h2>

      <div className="journey-toggle">
        <button type="button" className={journeyType === 'hajj' ? 'active' : ''} onClick={() => { setJourneyType('hajj'); setSelectedPkg(null); }}>
          {t('registration.hajjJourney')}
        </button>
        <button type="button" className={journeyType === 'umrah' ? 'active' : ''} onClick={() => { setJourneyType('umrah'); setSelectedPkg(null); }}>
          {t('registration.umrahJourney')}
        </button>
      </div>

      <div className="pkg-selection-grid">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className={`pkg-option ${selectedPkg?.id === pkg.id ? 'selected' : ''}`} onClick={() => setSelectedPkg(pkg)} style={{ border: selectedPkg?.id === pkg.id ? '2px solid #064e3b' : '1px solid #eee', cursor: 'pointer', padding: '1rem', borderRadius: '8px' }}>
            <h3>{pkg.title}</h3>
            <p>{pkg.duration} | {pkg.price}</p>
          </div>
        ))}
      </div>

      {selectedPkg && (
        <div className="reg-form-container" style={{ marginTop: '2rem' }}>
          {user ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '10px' }}>
              <FaCheckCircle size={50} color="#064e3b" style={{ marginBottom: '1rem' }} />
              <h3>{t('registration.welcome')} {user.name}!</h3>
              <p>{t('registration.registeringFor')} <strong>{selectedPkg.title}</strong></p>
              <button onClick={handleSubmit} className="submit-btn" style={{ marginTop: '1.5rem' }}>
                {t('registration.confirmBtn')}
              </button>
            </div>
          ) : (
            <form className="reg-form" onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '2rem', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                {t('registration.registeringFor')} {selectedPkg.title}
              </h3>

              <div className="input-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaUser /> {t('registration.fullName')}</label>
                  <input type="text" name="name" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaPhone /> {t('registration.phone')}</label>
                  <input type="tel" name="phone" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
              </div>

              <div className="input-row" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaIdCard /> {t('registration.nid')}</label>
                  <input type="number" name="nid" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label><FaPassport /> {t('registration.passportNumber')}</label>
                  <input type="text" name="passport" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '20px' }}>
                <label><FaEnvelope /> {t('registration.email')}</label>
                <input type="email" name="email" onChange={handleInputChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>

              <button type="submit" className="submit-btn" style={{ width: '100%', padding: '12px', background: '#064e3b', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer' }}>
                {t('registration.completeBtn')}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Registration;