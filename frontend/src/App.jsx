import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopHeader from './components/TopHeader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutPreview from './components/AboutPreview';
import FeaturedPackages from './components/FeaturedPackages';
import Testimonials from './components/Testimonials';
import './styles/AppLayout.css';
import ScrollToTop from './components/ScrollToTop';
import HajjPage from './pages/public/HajjPage';
import UmrahPage from './pages/public/UmrahPage';
import PreRegistration from './pages/public/PreRegistration';
import VisaRequirements from './pages/public/VisaRequirements';
import PackagesPage from './pages/public/PackagesPage';
import AboutUs from './pages/public/AboutUs';
import Agents from './pages/public/Agents';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import HajjTraining from './pages/public/HajjTraining';
import UserDashboard from './pages/private/UserDashboard';
import Registration from './pages/public/Registration.jsx';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Adjust path if needed
import ClientDashboard from './pages/client/ClientDashboard'; // Adjust path based on where you saved it

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

import Login from './pages/public/Login';
import PackageDetails from './pages/public/PackageDetails';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopHeader />
      <Navbar />

      <main className="main-content" style={{ minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hajj" element={<HajjPage />} />
          <Route path="/umrah" element={<UmrahPage />} />
          <Route path="/hajj/pre-registration" element={<PreRegistration />} />
          <Route path="/visa-requirements" element={<VisaRequirements />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/training" element={<HajjTraining />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute allowedRole="CLIENT">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
