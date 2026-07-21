import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaCreditCard,
  FaFileInvoice,
  FaLock,
  FaPlaneDeparture,
  FaSearch,
  FaSpinner,
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Track = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      const successfulId = location.state.bookingId;
      setTrackingId(successfulId);
      fetchTrackingData(successfulId);
      window.history.replaceState({}, document.title);
      alert('✅ Payment Confirmed! Your financial ledger has been updated.');
    }
  }, [location.state]);

  const fetchTrackingData = async (idToTrack) => {
    setError('');
    setLoading(true);
    try {
      const cleanId = idToTrack.trim();
      const response = await fetch(`${API_URL}/api/track/${cleanId}`);
      const data = await response.json();
      if (response.ok) {
        setBookingData(data);
        setShowPaymentInput(false);
      } else {
        setError(data.error);
        setBookingData(null);
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    fetchTrackingData(trackingId);
  };

  const handleInitiatePayment = () => {
    // FIX: Force numeric conversion
    const remaining = Number(bookingData.total_cost) - Number(bookingData.amount_paid);
    setPaymentAmount(remaining.toString());
    setShowPaymentInput(true);
  };

  const handleRedirectToGateway = () => {
    const amount = parseInt(paymentAmount);
    // FIX: Force numeric conversion
    const remaining = Number(bookingData.total_cost) - Number(bookingData.amount_paid);
    if (!amount || amount <= 0) return alert('Please enter a valid amount.');
    if (amount > remaining) return alert(`Maximum allowed payment is ${remaining} BDT.`);
    navigate('/secure-gateway', {
      state: {
        bookingId: bookingData.id,
        amount: amount,
        clientName: bookingData.client_name,
      },
    });
  };

  const getStepClass = (stepIndex, currentStatus) => {
    const statuses = ['PENDING_APPROVAL', 'DOCUMENTS_NEEDED', 'PROCESSING_VISA', 'READY_TO_TRAVEL'];
    const currentIndex = statuses.indexOf(currentStatus);
    if (currentIndex > stepIndex) return 'step completed';
    if (currentIndex === stepIndex) return 'step active';
    return 'step pending';
  };

  return (
    <div
      className="dashboard-layout"
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '4rem 1rem',
        background: '#f8fafc',
      }}
    >
      {/* INTERNAL CSS FOR MOBILE RESPONSIVENESS */}
      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          /* 1. Fix the main layout padding */
          .dashboard-layout {
            padding: 2rem 1rem !important;
          }
          
          .dashboard-main {
            padding: 1.5rem 1rem !important;
            border-radius: 12px !important;
          }

          /* 2. Fix the Search Form (Stack it) */
          .search-form {
            flex-direction: column;
            padding: 15px !important;
            border-radius: 15px !important;
          }
          
          .search-form input {
            width: 100% !important;
            box-sizing: border-box;
            padding: 15px !important;
          }

          .search-form button {
            width: 100% !important;
            justify-content: center;
            padding: 12px 0 !important;
            border-radius: 10px !important;
          }

          /* 3. Fix the Profile Header */
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px !important;
          }
          
          .dashboard-header h1 {
            font-size: 1.5rem !important;
          }

          /* 4. Fix Financial Cards (Stack them and reduce padding) */
          .financial-card {
            min-width: 100% !important;
            padding: 1.25rem !important;
            text-align: center;
          }

          .financial-card h3 {
            font-size: 1.6rem !important;
          }

          /* 5. Fix the Payment Box */
          .payment-box {
            padding: 1.5rem 1rem !important;
          }

          .payment-box button {
            padding: 12px 20px !important;
            font-size: 1rem !important;
            width: 100%;
            justify-content: center;
          }

          .payment-actions {
            flex-direction: column;
            gap: 10px !important;
          }

          /* 6. Fix the Stepper Container so it stops squishing text */
          .stepper-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .step-content h4 {
            font-size: 1rem !important;
          }
          
          .step-content p {
            font-size: 0.85rem !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#064e3b', marginBottom: '10px' }}>
          Track Your Journey
        </h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Enter your Secure Tracking ID below.
        </p>
        <form
          className="search-form"
          onSubmit={handleTrackSubmit}
          style={{
            display: 'flex',
            gap: '10px',
            background: 'white',
            padding: '8px',
            borderRadius: '50px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          }}
        >
          <input
            type="text"
            placeholder="e.g., 550e8400-e29b-41d4..."
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            style={{
              flex: 1,
              padding: '12px 25px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#064e3b',
              color: 'white',
              padding: '0 30px',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
            }}
          >
            {loading ? (
              <FaSpinner className="spin-anim" />
            ) : (
              <>
                <FaSearch /> Track
              </>
            )}
          </button>
        </form>
        {error && (
          <div
            style={{
              color: '#ef4444',
              marginTop: '1.5rem',
              background: '#fee2e2',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '500',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {bookingData && (
        <main
          className="dashboard-main fade-in"
          style={{
            maxWidth: '850px',
            width: '100%',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            padding: '3rem',
            borderTop: '6px solid #064e3b',
            boxSizing: 'border-box',
          }}
        >
          <header
            className="dashboard-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '1px',
                }}
              >
                Pilgrim Profile
              </p>
              <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '5px 0' }}>
                {bookingData.client_name}
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                ID:{' '}
                <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                  {bookingData.id}
                </code>
              </p>
            </div>
            <div
              style={{
                background: '#ecfdf5',
                color: '#064e3b',
                padding: '8px 20px',
                borderRadius: '30px',
                fontWeight: 'bold',
                border: '1px solid #a7f3d0',
              }}
            >
              {bookingData.package_name}
            </div>
          </header>

          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                className="financial-card"
                style={{
                  flex: '1',
                  minWidth: '200px',
                  background: '#f8fafc',
                  padding: '2rem',
                  borderRadius: '15px',
                  border: '1px solid #e2e8f0',
                  boxSizing: 'border-box',
                }}
              >
                <p
                  style={{
                    color: '#64748b',
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}
                >
                  Amount Paid
                </p>
                {/* FIX: Force numeric conversion for display */}
                <h3 style={{ margin: 0, fontSize: '2rem', color: '#16a34a' }}>
                  {Number(bookingData.amount_paid).toLocaleString()}{' '}
                  <span style={{ fontSize: '1rem', color: '#64748b' }}>BDT</span>
                </h3>
              </div>
              <div
                className="financial-card"
                style={{
                  flex: '1',
                  minWidth: '200px',
                  background: '#f8fafc',
                  padding: '2rem',
                  borderRadius: '15px',
                  border: '1px solid #e2e8f0',
                  boxSizing: 'border-box',
                }}
              >
                <p
                  style={{
                    color: '#64748b',
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}
                >
                  Total Cost
                </p>
                {/* FIX: Force numeric conversion for display */}
                <h3 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>
                  {Number(bookingData.total_cost).toLocaleString()}{' '}
                  <span style={{ fontSize: '1rem', color: '#64748b' }}>BDT</span>
                </h3>
              </div>
            </div>

            {/* FIX: Force numeric comparison */}
            {Number(bookingData.amount_paid) < Number(bookingData.total_cost) ? (
              <div
                className="payment-box"
                style={{
                  background: 'white',
                  padding: '2.5rem',
                  borderRadius: '15px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                  textAlign: 'center',
                }}
              >
                {!showPaymentInput ? (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0 0 10px 0' }}>
                      Ready to complete your payment?
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem' }}>
                      Remaining Balance:{' '}
                      <strong style={{ color: '#d97706' }}>
                        {/* FIX: Force numeric conversion */}
                        {(Number(bookingData.total_cost) - Number(bookingData.amount_paid)).toLocaleString()} BDT
                      </strong>
                    </p>
                    <button
                      onClick={handleInitiatePayment}
                      style={{
                        background: '#064e3b',
                        color: 'white',
                        border: 'none',
                        padding: '15px 40px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(6, 78, 59, 0.2)',
                      }}
                    >
                      <FaLock /> Pay Online Safely
                    </button>
                  </div>
                ) : (
                  <div
                    className="fade-in"
                    style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'left' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <label style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#334155' }}>
                        Amount to Pay (BDT)
                      </label>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Remaining:{' '}
                        {/* FIX: Force numeric conversion */}
                        {(Number(bookingData.total_cost) - Number(bookingData.amount_paid)).toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px solid #064e3b',
                        outline: 'none',
                        fontSize: '1.2rem',
                        marginBottom: '20px',
                        background: '#f8fafc',
                        boxSizing: 'border-box',
                      }}
                    />
                    <div className="payment-actions" style={{ display: 'flex', gap: '15px' }}>
                      <button
                        onClick={() => setShowPaymentInput(false)}
                        style={{
                          flex: 1,
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #cbd5e1',
                          padding: '15px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          transition: '0.2s',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRedirectToGateway}
                        style={{
                          flex: 2,
                          background: '#064e3b',
                          color: 'white',
                          border: 'none',
                          padding: '15px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                          transition: '0.2s',
                          boxShadow: '0 4px 15px rgba(6, 78, 59, 0.2)',
                        }}
                      >
                        Proceed to Gateway <FaArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: '#16a34a',
                  fontWeight: 'bold',
                  padding: '25px',
                  background: '#f0fdf4',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  border: '1px solid #bbf7d0',
                  fontSize: '1.2rem',
                }}
              >
                <FaCheckCircle size={28} /> Fully Paid! Enjoy your spiritual journey.
              </div>
            )}
          </div>

          <section
            className="progress-section"
            style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}
          >
            <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', color: '#0f172a' }}>
              Journey Milestones
            </h2>
            <div className="stepper-container">
              <div className={getStepClass(0, bookingData.status)}>
                <div className="step-icon">
                  {getStepClass(0, bookingData.status).includes('completed') ? (
                    <FaCheckCircle />
                  ) : (
                    <FaSpinner
                      className={
                        getStepClass(0, bookingData.status).includes('active') ? 'spin-anim' : ''
                      }
                    />
                  )}
                </div>
                <div className="step-content">
                  <h4>Application Review</h4>
                  <p>Initial registration submitted.</p>
                </div>
              </div>
              <div className={getStepClass(1, bookingData.status)}>
                <div className="step-icon">
                  {getStepClass(1, bookingData.status).includes('completed') ? (
                    <FaCheckCircle />
                  ) : (
                    <FaFileInvoice />
                  )}
                </div>
                <div className="step-content">
                  <h4>Document Verification</h4>
                  <p>Verifying your NID and Passport.</p>
                </div>
              </div>
              <div className={getStepClass(2, bookingData.status)}>
                <div className="step-icon">
                  {getStepClass(2, bookingData.status).includes('completed') ? (
                    <FaCheckCircle />
                  ) : (
                    <FaCreditCard />
                  )}
                </div>
                <div className="step-content">
                  <h4>Visa & Payments</h4>
                  <p>Processing visa and payments.</p>
                </div>
              </div>
              <div className={getStepClass(3, bookingData.status)}>
                <div className="step-icon">
                  {getStepClass(3, bookingData.status).includes('completed') ||
                  getStepClass(3, bookingData.status).includes('active') ? (
                    <FaPlaneDeparture color="green" />
                  ) : (
                    <FaPlaneDeparture />
                  )}
                </div>
                <div className="step-content">
                  <h4>Ready for Departure</h4>
                  <p>Visa approved!</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Track;