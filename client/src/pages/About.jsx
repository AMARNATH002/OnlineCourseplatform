import './About.css';

function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="container">
          <h1>About The Compilers Courses</h1>
          <p>Empowering developers worldwide with cutting-edge programming education</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>
                At The Compilers Courses, we believe that quality programming education should be 
                accessible to everyone. Our mission is to provide comprehensive, practical, and 
                up-to-date courses that help developers at all levels advance their careers and 
                build amazing software.
              </p>
              
              <h2>What Makes Us Different</h2>
              <ul>
                <li>Industry-expert instructors with real-world experience</li>
                <li>Hands-on projects and practical assignments</li>
                <li>Regular course updates to match industry trends</li>
                <li>Supportive community of learners and mentors</li>
                <li>Flexible learning paths for different skill levels</li>
              </ul>
            </div>
            
            <div className="about-stats">
              <div className="stat-card">
                <h3>10,000+</h3>
                <p>Students Enrolled</p>
              </div>
              <div className="stat-card">
                <h3>50+</h3>
                <p>Expert Instructors</p>
              </div>
              <div className="stat-card">
                <h3>100+</h3>
                <p>Courses Available</p>
              </div>
              <div className="stat-card">
                <h3>95%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>AMARNATH M</h3>
              <p>Lead Instructor - Full Stack Development</p>
              <p>10+ years experience at Google and Microsoft</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>RUPAK </h3>
              <p>Senior Instructor - Data Science</p>
              <p>PhD in Computer Science, ex-Facebook</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>DEEPAK & JEEVAN</h3>
              <p>DevOps Specialist</p>
              <p>Cloud architecture expert, ex-Amazon</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;