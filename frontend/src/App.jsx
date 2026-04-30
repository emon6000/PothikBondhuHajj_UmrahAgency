import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/AppLayout.css';

// Temporary placeholder components (We will move these to the 'pages' folder later)
const Home = () => <h2>Home Page: Find Your Package</h2>;
const Packages = () => <h2>Packages: Browse All Hajj & Umrah Plans</h2>;
const Login = () => <h2>Login to Your Dashboard</h2>;

function App() {
  return (
    <BrowserRouter>
      {/* A simple navigation bar */}
      <nav className="navbar">
        <Link to="/">Pothik Bondhu</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/login">Login</Link>
      </nav>

      {/* The main content area where pages will render */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;