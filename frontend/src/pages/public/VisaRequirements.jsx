import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPassport, FaIdCard, FaFileImage, FaSyringe, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const VisaRequirements = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('hajj');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type === 'umrah' || type === 'hajj') {
      setActiveTab(type);
    }
  }, [location]);

  return (
    <div className="visa-page">
      <div className="visa-header">
        <h2>{t('visa.title')}</h2>
        <p>{t('visa.subtitle')}</p>
      </div>

      <div className="visa-tabs">
        <button className={`tab-btn ${activeTab === 'hajj' ? 'active' : ''}`} onClick={() => setActiveTab('hajj')}>
          {t('visa.hajjTab')}
        </button>
        <button className={`tab-btn ${activeTab === 'umrah' ? 'active' : ''}`} onClick={() => setActiveTab('umrah')}>
          {t('visa.umrahTab')}
        </button>
      </div>

      <div className="visa-content-container">
        {activeTab === 'hajj' && (
          <div className="visa-content-panel fade-in">
            <h3 className="panel-title">{t('visa.hajjPanelTitle')}</h3>
            <p className="panel-desc">{t('visa.hajjPanelDesc')}</p>
            
            <div className="req-grid">
              <div className="req-card">
                <FaPassport className="req-icon" />
                <h4>{t('visa.passportTitle')}</h4>
                <p>{t('visa.passportDesc')}</p>
              </div>
              
              <div className="req-card">
                <FaIdCard className="req-icon" />
                <h4>{t('visa.nidTitle')}</h4>
                <p>{t('visa.nidDesc')}</p>
              </div>

              <div className="req-card">
                <FaFileImage className="req-icon" />
                <h4>{t('visa.photoTitle')}</h4>
                <p>{t('visa.photoDesc')}</p>
              </div>

              <div className="req-card">
                <FaSyringe className="req-icon" />
                <h4>{t('visa.vaccineTitle')}</h4>
                <p>{t('visa.vaccineDesc')}</p>
              </div>

              <div className="req-card">
                <FaNotesMedical className="req-icon" />
                <h4>{t('visa.medTitle')}</h4>
                <p>{t('visa.medDesc')}</p>
              </div>

              <div className="req-card">
                <FaCheckCircle className="req-icon" />
                <h4>{t('visa.bioTitle')}</h4>
                <p>{t('visa.bioDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'umrah' && (
          <div className="visa-content-panel fade-in">
            <h3 className="panel-title">{t('visa.umrahPanelTitle')}</h3>
            <p className="panel-desc">{t('visa.umrahPanelDesc')}</p>
            
            <div className="req-grid">
              <div className="req-card">
                <FaPassport className="req-icon" />
                <h4>{t('visa.scannedPassportTitle')}</h4>
                <p>{t('visa.scannedPassportDesc')}</p>
              </div>
              
              <div className="req-card">
                <FaFileImage className="req-icon" />
                <h4>{t('visa.digitalPhotoTitle')}</h4>
                <p>{t('visa.digitalPhotoDesc')}</p>
              </div>

              <div className="req-card">
                <FaIdCard className="req-icon" />
                <h4>{t('visa.nidCopyTitle')}</h4>
                <p>{t('visa.nidCopyDesc')}</p>
              </div>

              <div className="req-card">
                <FaCheckCircle className="req-icon" />
                <h4>{t('visa.bioTitle')}</h4>
                <p>{t('visa.umrahBioDesc')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaRequirements;