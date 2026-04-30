import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import your page sections
import Hero from './components/Hero';
import AboutPreview from './components/AboutPreview';
import FeaturedPackages from './components/FeaturedPackages';
import Testimonials from './components/Testimonials';
import './styles/AppLayout.css';

// 1. Build the actual Home page component by combining the sections here!
const Home = () => {
  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedPackages />
      <Testimonials />
    </>
  );
};

// Placeholder pages for now
const Packages = () => <h2 style={{padding: '5rem', textAlign: 'center'}}>Packages Page Coming Soon</h2>;
const Login = () => <h2 style={{padding: '5rem', textAlign: 'center'}}>Login Page Coming Soon</h2>;

function App() {
  return (
    <BrowserRouter>
      {/* Persistent Top Navigation */}
      <TopHeader />
      <Navbar />

      {/* Dynamic Content Area */}
      <main className="main-content" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Persistent Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;