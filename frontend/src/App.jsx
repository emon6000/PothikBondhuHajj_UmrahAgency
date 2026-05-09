// --- ALL IMPORTS MUST BE AT THE TOP ---
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import './styles/AppLayout.css';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Hero from './components/Hero';
import AboutPreview from './components/AboutPreview';
import FeaturedPackages from './components/FeaturedPackages';
import Testimonials from './components/Testimonials';
import PreRegistration from './pages/public/PreRegistration';
import Registration from './pages/public/Registration'; // <-- Added back here!
import VisaRequirements from './pages/public/VisaRequirements';
import PackagesPage from './pages/public/PackagesPage';
import PackageDetails from './pages/public/PackageDetails';
import AboutUs from './pages/public/AboutUs';
import Agents from './pages/public/Agents';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import HajjTraining from './pages/public/HajjTraining';
import Track from './pages/public/Track.jsx';
import Login from './pages/public/Login';

// Admin & Protected Routes
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute'; 

// --- HOME COMPONENT ---
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

// --- MAIN APP COMPONENT ---
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <Routes>
        
        {/* =========================================
            ENVIRONMENT 1: THE PUBLIC WEBSITE 
            (Wrapped in Navbar & Footer)
        ========================================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          <Route path="/register" element={<Registration />} /> {/* <-- Route fixed here! */}
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
        </Route>

        {/* =========================================
            ENVIRONMENT 2: THE SECURE ADMIN PORTAL 
            (Completely isolated, no heavy public UI)
        ========================================= */}
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