import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Certificate from '../components/Certificate';
import './Cart.css';

function Cart({ user, onCartUpdate }) {
  const [cartCourses, setCartCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cart');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartData();
  }, [user, navigate]);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [cartRes, completedRes, pendingRes, purchasedRes, certificatesRes] = await Promise.all([
        fetch('http://localhost:5000/api/cart', { headers }),
        fetch('http://localhost:5000/api/courses/completed', { headers }),
        fetch('http://localhost:5000/api/courses/pending', { headers }),
        fetch('http://localhost:5000/api/courses/purchased', { headers }),
        fetch('http://localhost:5000/api/certificates', { headers })
      ]);

      if (cartRes.ok) setCartCourses(await cartRes.json());
      if (completedRes.ok) setCompletedCourses(await completedRes.json());
      if (pendingRes.ok) setPendingCourses(await pendingRes.json());
      if (purchasedRes.ok) setPurchasedCourses(await purchasedRes.json());
      if (certificatesRes.ok) setCertificates(await certificatesRes.json());
    } catch (error) {
      console.error('Error fetching cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/remove/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setCartCourses(cartCourses.filter(course => course._id !== courseId));
        onCartUpdate();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const markAsCompleted = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/courses/complete/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
    }
  };

  const markAsPending = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/courses/pending/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error marking as pending:', error);
    }
  };

  const calculateTotal = () => {
    return cartCourses.reduce((total, course) => {
      return total + (course.isFree ? 0 : course.price);
    }, 0);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <div className="cart-header">
          <h1>My Learning</h1>
          <div className="cart-tabs">
            <button 
              className={activeTab === 'cart' ? 'active' : ''} 
              onClick={() => setActiveTab('cart')}
            >
              Cart ({cartCourses.length})
            </button>
            <button 
              className={activeTab === 'completed' ? 'active' : ''} 
              onClick={() => setActiveTab('completed')}
            >
              Completed ({completedCourses.length})
            </button>
            <button 
              className={activeTab === 'pending' ? 'active' : ''} 
              onClick={() => setActiveTab('pending')}
            >
              Pending ({pendingCourses.length})
            </button>
          </div>
        </div>

        {activeTab === 'cart' && (
          <div className="cart-content">
            {cartCourses.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Browse our courses and add them to your cart</p>
                <button onClick={() => navigate('/courses')} className="btn-browse">
                  Browse Courses
                </button>
              </div>
            ) : (
              <>
                <div className="cart-courses">
                  {cartCourses.map(course => (
                    <div key={course._id} className="cart-course-card">
                      <div className="course-info">
                        <h3>{course.name}</h3>
                        <p className="course-instructor">By {course.instructor}</p>
                        <p className="course-details">
                          {course.duration} • {course.days} days
                        </p>
                        <div className="course-actions">
                          {course.isFree || purchasedCourses.some(p => p._id === course._id) ? (
                            <button 
                              onClick={() => navigate(`/learn/${course._id}`)}
                              className="btn-pending"
                            >
                              Start Learning
                            </button>
                          ) : (
                            <button 
                              className="btn-locked"
                              disabled
                              title="Purchase required to access this course"
                            >
                              🔒 Locked
                            </button>
                          )}
                          <button 
                            onClick={() => removeFromCart(course._id)}
                            className="btn-remove"
                          >
                            Remove
                          </button>
                          {!course.isFree && !purchasedCourses.some(p => p._id === course._id) && (
                            <span className="course-note">💳 Payment required</span>
                          )}
                        </div>
                      </div>
                      <div className="course-price">
                        {course.isFree ? 'Free' : `₹${course.price}`}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <div className="summary-card">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                      <span>Total Courses:</span>
                      <span>{cartCourses.length}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <button 
                      onClick={() => navigate('/checkout')}
                      className="btn-checkout"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="courses-list">
            {completedCourses.length === 0 ? (
              <div className="empty-state">
                <h3>No completed courses yet</h3>
                <p>Complete some courses to see them here</p>
              </div>
            ) : (
              completedCourses.map(course => {
                const certificate = certificates.find(cert => cert.courseId._id === course._id);
                return (
                  <div key={course._id} className="course-item completed">
                    <div className="course-info">
                      <div className="course-title-with-check">
                        <h3>{course.name}</h3>
                        <span className="completion-check">✅</span>
                      </div>
                      <p>By {course.instructor}</p>
                      <span className="status-badge completed">✓ Completed</span>
                    </div>
                    <div className="course-actions-completed">
                      <button 
                        onClick={() => navigate(`/learn/${course._id}`)}
                        className="btn-action btn-view"
                      >
                        View Course
                      </button>
                      {certificate && (
                        <button 
                          onClick={() => setSelectedCertificate(certificate)}
                          className="btn-action btn-certificate"
                        >
                          📜 Certificate
                        </button>
                      )}
                      <button 
                        onClick={() => markAsPending(course._id)}
                        className="btn-action btn-restart"
                      >
                        Restart Course
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="courses-list">
            {pendingCourses.length === 0 ? (
              <div className="empty-state">
                <h3>No pending courses</h3>
                <p>Add courses to your cart and start learning</p>
              </div>
            ) : (
              pendingCourses.map(course => (
                <div key={course._id} className="course-item pending">
                  <div className="course-info">
                    <h3>{course.name}</h3>
                    <p>By {course.instructor}</p>
                    <span className="status-badge pending">⏳ In Progress</span>
                  </div>
                  <div className="course-actions-pending">
                    <button 
                      onClick={() => navigate(`/learn/${course._id}`)}
                      className="btn-action btn-continue"
                    >
                      Continue Learning
                    </button>
                    <button 
                      onClick={() => markAsCompleted(course._id)}
                      className="btn-action btn-complete"
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {selectedCertificate && (
        <Certificate 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
        />
      )}
    </div>
  );
}

export default Cart;