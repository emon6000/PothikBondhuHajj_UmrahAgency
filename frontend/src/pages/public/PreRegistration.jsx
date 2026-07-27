import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaEnvelope, FaIdCard, FaPassport, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PreRegistration = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { t } = useTranslation();

  const [hajjPackages, setHajjPackages] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/packages`);
        const data = await response.json();
        setHajjPackages(data.filter((pkg) => pkg.type === 'hajj'));
      } catch (err) {
        console.error('Failed to load packages', err);
      }
    };
    fetchPackages();
  }, [API_URL]);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('pothik_user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const [selectedPkgId, setSelectedPkgId] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nid: '', passport: '' });

  const handleSelectPackage = (pkgId) => {
    setSelectedPkgId(pkgId);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkgId) return alert(t('preRegistration.selectAlert'));

    try {
      if (user) {
        const response = await fetch(`${API_URL}/api/create-booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, packageId: selectedPkgId }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(`${t('preRegistration.successAlert')}${data.message}`);
          navigate('/');
        } else alert(`Error: ${data.error}`);
      } else {
        const response = await fetch(`${API_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, packageId: selectedPkgId }),
        });
        const data = await response.json();
        if (response.ok) {
          alert(t('preRegistration.appSubmitted'));
          navigate('/');
        } else alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(t('preRegistration.connectError'));
    }
  };

  return (
    <div className="registration-page">
      <section className="reg-packages-section">
        <div className="reg-header">
          <h2>{t('preRegistration.title')}</h2>
          <p>{t('preRegistration.subtitle')}</p>
        </div>

        <div className="reg-packages-grid">
          {hajjPackages.length === 0 ? <p>{t('preRegistration.loading')}</p> : null}
          {hajjPackages.map((pkg) => (
            <div className="reg-card" key={pkg.id} style={{ border: selectedPkgId === pkg.id ? '2px solid #064e3b' : '1px solid #eee' }}>
              <div className="reg-card-header">
                <h3>{pkg.title}</h3>
                <span className="reg-badge">{pkg.type.toUpperCase()}</span>
              </div>
              <div className="reg-card-body">
                <p><strong>{t('packagesPage.duration')}:</strong> {pkg.duration}</p>
                <p className="reg-fee">
                  <strong>{t('preRegistration.cost')}:</strong> <br />
                  {pkg.cost.toLocaleString()} BDT
                </p>
                <ul style={{ textAlign: 'left', fontSize: '0.85em', marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                  {pkg.features ? pkg.features.split(',').map((feature, index) => <li key={index}>{feature.trim()}</li>) : null}
                </ul>
              </div>
              <button type="button" className="select-pkg-btn" onClick={() => handleSelectPackage(pkg.id)}>
                {selectedPkgId === pkg.id ? t('preRegistration.selected') : t('preRegistration.selectBtn')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="reg-form-section" ref={formRef}>
        <div className="form-container">
          {user ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <FaCheckCircle size={50} color="#064e3b" style={{ marginBottom: '1rem' }} />
              <h3>{t('preRegistration.welcome')} {user.name}!</h3>
              <div className="form-group full-width" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <label>{t('preRegistration.confirmSel')}</label>
                <select required value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)} className="reg-input">
                  <option value="" disabled>{t('preRegistration.choosePkg')}</option>
                  {hajjPackages.map((pkg) => (<option key={pkg.id} value={pkg.id}>{pkg.title}</option>))}
                </select>
              </div>
              <button onClick={handleSubmit} className="submit-reg-btn" style={{ marginTop: '2rem' }}>
                {t('preRegistration.confirmBook')}
              </button>
            </div>
          ) : (
            <>
              <div className="form-header">
                <h3>{t('preRegistration.formHeader')}</h3>
                <p>{t('preRegistration.formSub')}</p>
              </div>
              <form onSubmit={handleSubmit} className="official-reg-form">
                <div className="form-group full-width">
                  <label>{t('preRegistration.selectTier')}</label>
                  <select required value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)} className="reg-input">
                    <option value="" disabled>{t('preRegistration.selectPlaceholder')}</option>
                    {hajjPackages.map((pkg) => (<option key={pkg.id} value={pkg.id}>{pkg.title}</option>))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><FaUser className="input-icon" /> {t('preRegistration.fullName')}</label>
                    <input type="text" name="name" onChange={handleInputChange} required className="reg-input" />
                  </div>
                  <div className="form-group">
                    <label><FaPhoneAlt className="input-icon" /> {t('preRegistration.phone')}</label>
                    <input type="tel" name="phone" onChange={handleInputChange} required className="reg-input" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label><FaIdCard className="input-icon" /> {t('preRegistration.nid')}</label>
                    <input type="number" name="nid" onChange={handleInputChange} required className="reg-input" />
                  </div>
                  <div className="form-group">
                    <label><FaPassport className="input-icon" /> {t('preRegistration.passport')}</label>
                    <input type="text" name="passport" onChange={handleInputChange} required className="reg-input" />
                  </div>
                </div>
                <div className="form-group full-width" style={{ marginBottom: '1.5rem' }}>
                  <label><FaEnvelope className="input-icon" /> {t('preRegistration.email')}</label>
                  <input type="email" name="email" onChange={handleInputChange} required className="reg-input" />
                </div>
                <button type="submit" className="submit-reg-btn">
                  {t('preRegistration.submitBtn')}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PreRegistration;