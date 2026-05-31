import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/AppLayout.css';

import AdminLayout from './components/AdminLayout';
import PublicLayout from './components/PublicLayout';

import AboutPreview from './components/AboutPreview';
import FeaturedPackages from './components/FeaturedPackages';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import AboutUs from './pages/public/AboutUs';
import Agents from './pages/public/Agents';
import Contact from './pages/public/Contact';
import HajjTraining from './pages/public/HajjTraining';
import Login from './pages/public/Login';
import PackageDetails from './pages/public/PackageDetails';
import PackagesPage from './pages/public/PackagesPage';
import PreRegistration from './pages/public/PreRegistration';
import Privacy from './pages/public/Privacy';
import Registration from './pages/public/Registration';
import Terms from './pages/public/Terms';
import Track from './pages/public/Track.jsx';
import VisaRequirements from './pages/public/VisaRequirements';

import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import MockGateway from './pages/public/MockGateway.jsx';

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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          <Route path="/register" element={<Registration />} />
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
          <Route path="/secure-gateway" element={<MockGateway />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
