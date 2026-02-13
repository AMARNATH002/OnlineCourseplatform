import { useState } from 'react';
import './CourseCard.css';

function CourseCard({ course, user, onCartUpdate }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add courses to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/add/${course._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Course added to cart!');
        onCartUpdate();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add course to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add course to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">☆</span>);
    }

    return stars;
  };

  return (
    <div className="course-card">
      <div className="course-image">
        <div className="course-placeholder">
          <span className="course-icon">📚</span>
        </div>
        {course.recommended && <div className="recommended-badge">Recommended</div>}
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.name}</h3>
        <p className="course-instructor">By {course.instructor}</p>
        <p className="course-description">{course.description}</p>
        
        <div className="course-details">
          <div className="course-duration">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{course.duration}</span>
          </div>
          <div className="course-days">
            <span className="detail-label">Days:</span>
            <span className="detail-value">{course.days} days</span>
          </div>
        </div>

        <div className="course-rating">
          <div className="stars">
            {renderStars(course.ratings)}
          </div>
          <span className="rating-value">({course.ratings})</span>
        </div>

        <div className="course-footer">
          <div className="course-price">
            {course.isFree ? (
              <span className="price-free">Free</span>
            ) : (
              <span className="price-paid">₹{course.price}</span>
            )}
          </div>
          
          <button 
            className="btn-add-cart" 
            onClick={addToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;