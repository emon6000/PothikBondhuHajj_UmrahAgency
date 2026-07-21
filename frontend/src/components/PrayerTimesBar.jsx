import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const PrayerTimesBar = () => {
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh');
        const data = await response.json();
        setTimings(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer); 
  }, []);

  if (loading || !timings) return null;

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hourString, minute] = time24.split(':');
    let hour = parseInt(hourString, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const currentHourStr = currentTime.getHours().toString().padStart(2, '0');
  const currentMinStr = currentTime.getMinutes().toString().padStart(2, '0');
  const timeNowStr = `${currentHourStr}:${currentMinStr}`;

  const determineActiveWaqt = () => {
    if (timeNowStr >= timings.Fajr && timeNowStr < timings.Sunrise) return 'Fajr';
    if (timeNowStr >= timings.Dhuhr && timeNowStr < timings.Asr) return 'Dhuhr';
    if (timeNowStr >= timings.Asr && timeNowStr < timings.Sunset) return 'Asr';
    if (timeNowStr >= timings.Maghrib && timeNowStr < timings.Isha) return 'Maghrib';
    if (timeNowStr >= timings.Isha || timeNowStr < timings.Fajr) return 'Isha';
    
    return 'None'; 
  };

  const activeWaqt = determineActiveWaqt();

  const schedule = [
    { name: 'Fajr', start: timings.Fajr, end: timings.Sunrise },
    { name: 'Dhuhr', start: timings.Dhuhr, end: timings.Asr },
    { name: 'Asr', start: timings.Asr, end: timings.Sunset },
    { name: 'Maghrib', start: timings.Maghrib, end: timings.Isha },
    { name: 'Isha', start: timings.Isha, end: timings.Midnight }
  ];

  const renderScheduleItems = () => (
    <>
      {schedule.map((waqt, index) => {
        const isActive = activeWaqt === waqt.name;
        return (
          <div key={index} style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px',
            background: isActive ? 'rgba(202, 138, 4, 0.2)' : 'transparent',
            padding: isActive ? '4px 12px' : '4px 0',
            borderRadius: '20px',
            marginRight: '25px', 
            flexShrink: 0
          }}>
            <span style={{ color: isActive ? '#fde047' : '#ca8a04', fontWeight: isActive ? 'bold' : '500', whiteSpace: 'nowrap' }}>
              {isActive && "▶ "} {waqt.name}:
            </span>
            <span style={{ opacity: isActive ? 1 : 0.85, whiteSpace: 'nowrap' }}>
              {formatTime(waqt.start)} - {formatTime(waqt.end)}
            </span>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <style>
        {`
          @keyframes prayerMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            display: flex;
            white-space: nowrap;
            width: max-content;
            animation: prayerMarquee 25s linear infinite;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
          
          /* RESPONSIVE LAYOUT CLASSES */
          .prayer-bar-layout {
            display: flex;
            flex-direction: column; /* Mobile: Stack vertically */
            gap: 12px;
            padding: 12px 20px;
          }
          .static-info-group {
            display: flex;
            justify-content: space-between; /* Mobile: Location left, Clock right */
            width: 100%;
          }

          @media (min-width: 1024px) {
            .prayer-bar-layout {
              flex-direction: row; /* Desktop: Side-by-side */
              align-items: center;
              justify-content: space-between;
              padding: 10px 30px;
            }
            .static-info-group {
              width: auto;
              justify-content: flex-start;
              padding-right: 20px;
            }
            .marquee-wrapper {
              overflow: hidden !important;
            }
            .marquee-container {
              animation: none !important;
              width: 100% !important;
              justify-content: flex-end !important; 
            }
            .duplicate-items {
              display: none !important; 
            }
          }
        `}
      </style>

      <div className="prayer-bar-layout" style={{ 
        background: '#043b2c', 
        color: 'white', 
        fontSize: '0.9rem', 
        fontWeight: '500', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden'
      }}>
        
        {/* Static Location and Clock */}
        <div className="static-info-group" style={{ alignItems: 'center', gap: '15px', flexShrink: 0, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ca8a04', fontWeight: 'bold' }}>
            <FaMapMarkerAlt /> DHAKA, BD
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '15px' }}>
            <FaClock /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="marquee-wrapper" style={{ overflow: 'hidden', flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          <div className="marquee-container">
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              {renderScheduleItems()}
            </div>
            <div className="duplicate-items" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {renderScheduleItems()}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default PrayerTimesBar;