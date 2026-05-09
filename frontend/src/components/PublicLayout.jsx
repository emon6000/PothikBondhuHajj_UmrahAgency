import React from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './TopHeader';
import Navbar from './Navbar';
import PrayerTimesBar from './PrayerTimesBar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <>
      <TopHeader />
      <Navbar />
      <PrayerTimesBar />
      {/* <Outlet /> is the magic variable where your specific pages (Home, Track, etc.) will load */}
      <main className="main-content" style={{ minHeight: '60vh' }}>
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;