import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Learn Without Limits</h1>
          
          <div className="hero-actions">
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
            <Link to="/signup" className="btn-secondary">Join for Free</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <h3>🎓</h3>
            <p>Start Learning Today</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose The Compilers Courses?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Expert-Led Courses</h3>
              <p>Learn from industry experts with real-world experience</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Learn at Your Pace</h3>
              <p>Study when it fits your schedule, with lifetime access</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certificates</h3>
              <p>Earn certificates to showcase your new skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Affordable Learning</h3>
              <p>High-quality education at competitive prices</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students already learning with us</p>
          <Link to="/courses" className="btn-primary">Explore Courses</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;