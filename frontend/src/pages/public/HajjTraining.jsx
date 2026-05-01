import React from 'react';
import { FaBookOpen, FaChalkboardTeacher, FaMosque } from 'react-icons/fa';

const HajjTraining = () => {
  return (
    <div className="training-page">
      <div className="page-banner">
        <h1>Pre-Hajj Training Seminars</h1>
        <p>Prepare yourself spiritually and practically for the journey of a lifetime.</p>
      </div>

      <div className="training-container">
        <div className="training-intro">
          <h2>Why Attend Our Training?</h2>
          <p>Performing Hajj correctly requires knowledge of specific rituals, geographical awareness of Makkah/Madinah, and physical preparation. Our expert Moallems conduct regular workshops to ensure you are fully prepared.</p>
        </div>

        <div className="training-modules">
          <div className="module-card">
            <FaBookOpen className="module-icon" />
            <h3>Module 1: Fiqh of Hajj & Umrah</h3>
            <p>Learn the obligatory acts (Fard), Sunnahs, and prohibitions of Ihram. Understand the step-by-step rituals of Tawaf, Sa'i, and Wuquf at Arafat.</p>
          </div>

          <div className="module-card">
            <FaMosque className="module-icon" />
            <h3>Module 2: Practical Navigation</h3>
            <p>Visual walkthroughs of Masjid al-Haram, the Mina tent city, and the Jamarat bridges to help you avoid getting lost in the crowds.</p>
          </div>

          <div className="module-card">
            <FaChalkboardTeacher className="module-icon" />
            <h3>Module 3: Health & Logistics</h3>
            <p>Essential advice on staying hydrated, managing prescribed medications, and understanding the transport system between Makkah and Madinah.</p>
          </div>
        </div>

        <div className="training-schedule">
          <h3>Upcoming Training Sessions (Comilla Branch)</h3>
          <ul className="schedule-list">
            <li><strong>Batch A:</strong> May 15, 2026 - 10:00 AM (Men only)</li>
            <li><strong>Batch B:</strong> May 16, 2026 - 10:00 AM (Women only, led by female scholars)</li>
            <li><strong>Online Session:</strong> May 20, 2026 - via Zoom (Link provided upon registration)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HajjTraining;