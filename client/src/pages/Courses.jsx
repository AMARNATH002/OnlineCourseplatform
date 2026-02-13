import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import './Courses.css';

function Courses({ user, onCartUpdate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'free') return course.isFree;
    if (filter === 'paid') return !course.isFree;
    if (filter === 'recommended') return course.recommended;
    return true;
  });

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="loading-spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="courses">
      <div className="courses-header">
        <div className="container">
          <h1>All Courses</h1>
          <p>Choose from {courses.length} online video courses with new additions published every month</p>
          
          <div className="course-filters">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All Courses
            </button>
            <button 
              className={filter === 'free' ? 'active' : ''} 
              onClick={() => setFilter('free')}
            >
              Free
            </button>
            <button 
              className={filter === 'paid' ? 'active' : ''} 
              onClick={() => setFilter('paid')}
            >
              Paid
            </button>
            <button 
              className={filter === 'recommended' ? 'active' : ''} 
              onClick={() => setFilter('recommended')}
            >
              Recommended
            </button>
          </div>
        </div>
      </div>

      <div className="courses-content">
        <div className="container">
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                user={user}
                onCartUpdate={onCartUpdate}
              />
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="no-courses">
              <h3>No courses found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;