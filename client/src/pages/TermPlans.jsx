import './TermPlans.css';

function TermPlans() {
  const plans = [
    {
      name: 'Basic',
      price: 999,
      duration: '1 Month',
      features: [
        'Access to 20+ courses',
        'Basic support',
        'Course certificates',
        'Mobile app access',
        'Standard video quality'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 2499,
      duration: '3 Months',
      features: [
        'Access to 100+ courses',
        'Priority support',
        'Course certificates',
        'Mobile app access',
        'HD video quality',
        'Downloadable content',
        'Practice exercises'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: 4999,
      duration: '6 Months',
      features: [
        'Access to all courses',
        '24/7 premium support',
        'Course certificates',
        'Mobile app access',
        '4K video quality',
        'Downloadable content',
        'Practice exercises',
        'One-on-one mentoring',
        'Career guidance'
      ],
      popular: false
    }
  ];

  return (
    <div className="term-plans">
      <section className="plans-hero">
        <div className="container">
          <h1>Choose Your Learning Plan</h1>
          <p>Unlock your potential with our flexible subscription plans</p>
        </div>
      </section>

      <section className="plans-content">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="currency">₹</span>
                    <span className="amount">{plan.price}</span>
                    <span className="duration">/{plan.duration}</span>
                  </div>
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>
                        <span className="check-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`plan-button ${plan.popular ? 'popular' : ''}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className="plans-faq">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Can I cancel my subscription anytime?</h3>
                <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
              </div>
              <div className="faq-item">
                <h3>Do you offer refunds?</h3>
                <p>We offer a 30-day money-back guarantee for all our plans. If you're not satisfied, we'll refund your payment.</p>
              </div>
              <div className="faq-item">
                <h3>Can I switch plans?</h3>
                <p>Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="faq-item">
                <h3>Is there a free trial?</h3>
                <p>Yes, we offer a 7-day free trial for all new users. No credit card required to start your trial.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermPlans;