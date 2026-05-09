import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const PrayerTimesBar = () => {
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch the API Data
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

  // 2. Start the Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Updates every 1 second
    return () => clearInterval(timer); // Cleanup when component unmounts
  }, []);

  if (loading) return null;
  if (!timings) return null;

  // --- LOGIC HELPER FUNCTIONS ---

  // Convert API 24hr time to AM/PM for display
  const formatTime = (time24) => {
    if (!time24) return '';
    const [hourString, minute] = time24.split(':');
    let hour = parseInt(hourString, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Convert Live Date into "HH:MM" 24hr string to match API format
  const currentHourStr = currentTime.getHours().toString().padStart(2, '0');
  const currentMinStr = currentTime.getMinutes().toString().padStart(2, '0');
  const timeNowStr = `${currentHourStr}:${currentMinStr}`;

  // Determine which waqt is active right now
  const determineActiveWaqt = () => {
    if (timeNowStr >= timings.Fajr && timeNowStr < timings.Sunrise) return 'Fajr';
    if (timeNowStr >= timings.Dhuhr && timeNowStr < timings.Asr) return 'Dhuhr';
    if (timeNowStr >= timings.Asr && timeNowStr < timings.Sunset) return 'Asr';
    if (timeNowStr >= timings.Maghrib && timeNowStr < timings.Isha) return 'Maghrib';
    // Isha goes through midnight until Fajr
    if (timeNowStr >= timings.Isha || timeNowStr < timings.Fajr) return 'Isha';
    
    // If it's outside active prayer times (e.g., between Sunrise and Dhuhr)
    return 'None'; 
  };

  const activeWaqt = determineActiveWaqt();

  // The structured schedule
  const schedule = [
    { name: 'Fajr', start: timings.Fajr, end: timings.Sunrise },
    { name: 'Dhuhr', start: timings.Dhuhr, end: timings.Asr },
    { name: 'Asr', start: timings.Asr, end: timings.Sunset },
    { name: 'Maghrib', start: timings.Maghrib, end: timings.Isha },
    { name: 'Isha', start: timings.Isha, end: timings.Midnight }
  ];

  return (
    <div style={{ 
      background: '#043b2c', 
      color: 'white', 
      padding: '12px 20px', 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'space-between', // Pushes location left, times center/right
      alignItems: 'center', 
      gap: '20px', 
      fontSize: '0.9rem', 
      fontWeight: '500', 
      borderTop: '1px solid rgba(255,255,255,0.05)' 
    }}>
      
      {/* Left Side: Location & Live Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ca8a04', fontWeight: 'bold' }}>
          <FaMapMarkerAlt /> DHAKA, BD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '15px' }}>
          <FaClock /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Right Side: The 5 Waqt Times (with dynamic highlighting) */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        {schedule.map((waqt, index) => {
          const isActive = activeWaqt === waqt.name;
          
          return (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              // If it's the active waqt, add a nice golden highlight pill
              background: isActive ? 'rgba(202, 138, 4, 0.2)' : 'transparent',
              padding: isActive ? '4px 10px' : '4px 0',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ color: isActive ? '#fde047' : '#ca8a04', fontWeight: isActive ? 'bold' : 'normal' }}>
                {isActive && "▶ "} {waqt.name}:
              </span>
              <span style={{ opacity: isActive ? 1 : 0.8 }}>
                {formatTime(waqt.start)} - {formatTime(waqt.end)}
              </span>
              {/* Only show the separator if it's not the last item AND neither this item nor the next item is highlighted */}
              {index < schedule.length - 1 && !isActive && activeWaqt !== schedule[index+1]?.name && (
                <span style={{ color: 'rgba(255,255,255,0.15)', marginLeft: '10px' }}>|</span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PrayerTimesBar;