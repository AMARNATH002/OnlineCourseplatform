import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

function Checkout({ user, onCartUpdate }) {
  const [cartCourses, setCartCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const cart = await response.json();
        setCartCourses(cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const paidCourses = cartCourses.filter(course => !course.isFree);
    const freeCourses = cartCourses.filter(course => course.isFree);
    const subtotal = paidCourses.reduce((total, course) => total + course.price, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    
    return { paidCourses, freeCourses, subtotal, tax, total };
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Checkout Successful! 🎉\n\n✅ ${result.totalCourses} courses added to your Pending list\n💰 Total Amount: ₹${result.totalAmount}\n\nGo to "My Learning" → "Pending" to start your courses!`);
        onCartUpdate();
        navigate('/cart');
      } else {
        const error = await response.json();
        alert(`Payment Failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (cartCourses.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="container">
          <h2>Your cart is empty</h2>
          <p>Add some courses to your cart before checkout</p>
          <button onClick={() => navigate('/courses')} className="btn-browse">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  const { paidCourses, freeCourses, subtotal, tax, total } = calculateTotals();

  return (
    <div className="checkout">
      <div className="container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-button">
            ← Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              {paidCourses.length > 0 && (
                <div className="course-section">
                  <h3>Paid Courses ({paidCourses.length})</h3>
                  {paidCourses.map(course => (
                    <div key={course._id} className="checkout-course-item">
                      <div className="course-info">
                        <h4>{course.name}</h4>
                        <p>By {course.instructor}</p>
                      </div>
                      <div className="course-price">₹{course.price}</div>
                    </div>
                  ))}
                </div>
              )}

              {freeCourses.length > 0 && (
                <div className="course-section">
                  <h3>Free Courses ({freeCourses.length})</h3>
                  {freeCourses.map(course => (
                    <div key={course._id} className="checkout-course-item">
                      <div className="course-info">
                        <h4>{course.name}</h4>
                        <p>By {course.instructor}</p>
                      </div>
                      <div className="course-price free">Free</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {paidCourses.length > 0 && (
              <div className="payment-method">
                <h2>Payment Method</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>UPI</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Net Banking</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="price-summary">
              <h3>Price Details</h3>
              
              <div className="price-row">
                <span>Courses ({cartCourses.length})</span>
                <span>₹{subtotal}</span>
              </div>
              
              {subtotal > 0 && (
                <>
                  <div className="price-row">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {freeCourses.length > 0 && (
                <div className="free-courses-note">
                  <p>✓ {freeCourses.length} free course(s) will be added to your account</p>
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={processing}
                className="btn-pay"
              >
                {processing ? 'Processing...' : 
                 subtotal > 0 ? `Pay ₹${total.toFixed(2)}` : 'Add to Account'}
              </button>

              <div className="security-note">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;