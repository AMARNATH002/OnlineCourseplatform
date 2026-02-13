import { useRef } from 'react';
import './Certificate.css';

function Certificate({ certificate, onClose }) {
  const certificateRef = useRef();

  const downloadCertificate = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="certificate-modal">
      <div className="certificate-overlay" onClick={onClose}></div>
      <div className="certificate-container">
        <div className="certificate-actions">
          <button onClick={downloadCertificate} className="btn-download">
            📄 Download Certificate
          </button>
          <button onClick={onClose} className="btn-close">
            ✕ Close
          </button>
        </div>
        
        <div ref={certificateRef} className="certificate" id="certificate">
          <div className="certificate-border">
            <div className="certificate-content">
              
              <div className="certificate-logo">
                <h1>THE COMPILERS COURSES</h1>
              </div>

              <div className="certificate-body">
                <h2 className="student-name">{certificate.studentName}</h2>
                
                <p className="certificate-text">
                  is hereby awarded this certificate of achievement for the successful<br />
                  completion of <strong>{certificate.courseName}</strong> certification exam<br />
                  on {formatDate(certificate.completionDate)}
                </p>
              </div>

              <div className="certificate-footer">
                <div className="signature-section">
                  <div className="signature-item">
                    <div className="signature-line">The Compilers Team</div>
                    <p>Director - {formatDate(certificate.completionDate)}</p>
                  </div>
                  
                  <div className="certificate-badges">
                    <div className="badge">
                      <div className="badge-icon">🎓</div>
                      <p>CERTIFIED</p>
                    </div>
                    <div className="badge">
                      <div className="badge-icon">🏆</div>
                      <p>VERIFIED</p>
                    </div>
                  </div>
                  
                  <div className="signature-item">
                    <div className="signature-line">{certificate.instructor}</div>
                    <p>Instructor - IAB Report</p>
                  </div>
                </div>
                
                <div className="certificate-id">
                  Certificate ID: {certificate.certificateId}
                </div>
                
                <div className="certificate-verify">
                  Verify the authenticity of this certificate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;