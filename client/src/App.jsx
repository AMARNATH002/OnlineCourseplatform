import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import About from './pages/About';
import TermPlans from './pages/TermPlans';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import CourseLearning from './pages/CourseLearning';
import Checkout from './pages/Checkout';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const cart = await response.json();
        setCartCount(cart.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchCartCount();
  };

  const handleLogout = () => {
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} cartCount={cartCount} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses user={user} onCartUpdate={fetchCartCount} />} />
          <Route path="/about" element={<About />} />
          <Route path="/term-plans" element={<TermPlans />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/cart" element={<Cart user={user} onCartUpdate={fetchCartCount} />} />
          <Route path="/checkout" element={<Checkout user={user} onCartUpdate={fetchCartCount} />} />
          <Route path="/learn/:courseId" element={<CourseLearning />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
