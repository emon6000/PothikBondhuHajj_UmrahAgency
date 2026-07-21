import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MockGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { bookingId, amount, clientName } = location.state || {};

  if (!bookingId) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>
        Invalid Session
      </div>
    );
  }

  const handlePaymentSuccess = async (methodName) => {
    try {
      const response = await fetch(`${API_URL}/api/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount,
          method: `Online - ${methodName}`,
        }),
      });

      if (response.ok) {
        navigate('/track', { state: { paymentSuccess: true, bookingId } });
      } else {
        alert('Server error processing payment.');
        navigate('/track');
      }
    } catch (err) {
      alert('Payment Logging Failed');
      navigate('/track');
    }
  };

  return (
    <div className="gw-wrapper">
      <style>{`
        .gw-wrapper {
          min-height: 100vh;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }
        
        .gw-container {
          width: 100%;
          max-width: 420px;
          transition: all 0.3s ease;
        }

        .gw-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        /* Method Selection Styles */
        .gw-select-header { padding: 1.5rem 1.5rem 0.5rem; }
        .gw-select-title { font-size: 1.125rem; font-weight: 600; color: #111827; margin: 0; }
        .gw-select-subtitle { font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0 0 0; }
        
        .gw-method-group-title {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin: 1.25rem 0 0.5rem 0;
        }
        
        .gw-method-btn {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        .gw-method-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .gw-method-icon-box {
          width: 4rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }
        
        /* Form Flow Styles */
        .gw-flow-header {
          padding: 1rem 1.25rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .gw-flow-header-title { font-size: 1.25rem; font-weight: bold; margin: 0; }
        
        .gw-flow-subheader {
          background: #f9fafb;
          padding: 0.75rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.875rem;
        }
        
        .gw-form-body { padding: 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
        
        .gw-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          font-size: 1rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gw-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
        .gw-input.center { text-align: center; }
        .gw-input.mono { font-family: monospace; }
        .gw-input.pin { font-size: 1.5rem; letter-spacing: 0.4em; }

        /* Brand Specific Focus Colors */
        .bkash-focus:focus { border-color: #e2136e; box-shadow: 0 0 0 2px rgba(226, 19, 110, 0.2); }
        .nagad-focus:focus { border-color: #ec1c24; box-shadow: 0 0 0 2px rgba(236, 28, 36, 0.2); }
        .rocket-focus:focus { border-color: #8c3494; box-shadow: 0 0 0 2px rgba(140, 52, 148, 0.2); }
        .card-focus:focus { border-color: #0a2540; box-shadow: 0 0 0 2px rgba(10, 37, 64, 0.2); }

        .gw-btn-row { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .gw-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: bold;
          cursor: pointer;
          border: none;
          outline: none;
          transition: opacity 0.2s;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .gw-btn:hover { opacity: 0.9; }
        .gw-btn-cancel { background: white; border: 1px solid #d1d5db; color: #374151; }
        .gw-btn-cancel:hover { background: #f3f4f6; }
        
        .gw-footer {
          border-top: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: center;
          font-size: 0.65rem;
          color: #6b7280;
          background: #f9fafb;
        }

        .gw-spinner {
          width: 2.5rem;
          height: 2.5rem;
          border: 3px solid rgba(0,0,0,0.1);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: gw-spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes gw-spin {
          to { transform: rotate(360deg); }
        }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
          .gw-select-header, .gw-form-body { padding: 1.25rem 1rem; }
          .gw-flow-header, .gw-flow-subheader, .gw-footer { padding-left: 1rem; padding-right: 1rem; }
          .gw-method-icon-box { width: 3.5rem; height: 2.5rem; }
          .gw-input { font-size: 0.95rem; }
        }
      `}</style>

      <div className="gw-container">
        {!selectedMethod && <MethodSelect amount={amount} onSelect={setSelectedMethod} />}
        {selectedMethod === 'bkash' && (
          <BkashFlow
            amount={amount}
            onCancel={() => setSelectedMethod(null)}
            onSuccess={() => handlePaymentSuccess('bKash')}
          />
        )}
        {selectedMethod === 'nagad' && (
          <NagadFlow
            amount={amount}
            onCancel={() => setSelectedMethod(null)}
            onSuccess={() => handlePaymentSuccess('Nagad')}
          />
        )}
        {selectedMethod === 'rocket' && (
          <RocketFlow
            amount={amount}
            onCancel={() => setSelectedMethod(null)}
            onSuccess={() => handlePaymentSuccess('Rocket')}
          />
        )}
        {selectedMethod === 'card' && (
          <CardFlow
            amount={amount}
            onCancel={() => setSelectedMethod(null)}
            onSuccess={() => handlePaymentSuccess('Card')}
          />
        )}
      </div>
    </div>
  );
};

export default MockGateway;

// --- Components ---

const BkashLogo = () => <div style={{ fontSize: '1.25rem', fontWeight: 'bold', fontStyle: 'italic' }}>bKash</div>;
const NagadLogo = () => <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nagad</div>;
const RocketLogo = () => <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Rocket</div>;
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const methods = [
  {
    group: 'Mobile Banking',
    items: [
      { id: 'bkash', name: 'bKash', desc: 'Pay with your bKash wallet', bg: '#e2136e', color: 'white', logo: <BkashLogo /> },
      { id: 'nagad', name: 'Nagad', desc: 'Instant transfer via Nagad', bg: '#ec1c24', color: 'white', logo: <NagadLogo /> },
      { id: 'rocket', name: 'Rocket', desc: 'Dutch-Bangla Mobile Banking', bg: '#8c3494', color: 'white', logo: <RocketLogo /> },
    ],
  },
  {
    group: 'Cards',
    items: [
      {
        id: 'card',
        name: 'Credit / Debit Card',
        desc: 'Visa · Mastercard · Amex',
        bg: '#1f2937',
        color: 'white',
        logo: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ background: '#1a1f71', padding: '2px 4px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>VISA</span>
          </div>
        ),
      },
    ],
  },
];

function MethodSelect({ onSelect, amount }) {
  return (
    <div className="gw-card">
      <div className="gw-select-header">
        <h2 className="gw-select-title">Select payment method</h2>
        <p className="gw-select-subtitle">Pay ৳ {amount.toLocaleString()} using your preferred option.</p>
      </div>

      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        {methods.map((g) => (
          <div key={g.group}>
            <p className="gw-method-group-title">{g.group}</p>
            <div>
              {g.items.map((m) => (
                <button key={m.id} onClick={() => onSelect(m.id)} className="gw-method-btn">
                  <div className="gw-method-icon-box" style={{ background: m.bg, color: m.color }}>
                    {m.logo}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontWeight: 500, color: '#111827', fontSize: '0.95rem' }}>{m.name}</p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</p>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>
        ))}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: '#9ca3af' }}>
          🔒 Your information is encrypted and secure
        </p>
      </div>
    </div>
  );
}

function BkashFlow({ amount, onSuccess, onCancel }) {
  const [step, setStep] = useState('number');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const txnId = 'BK' + Math.random().toString().slice(2, 12);

  const next = (e) => {
    e.preventDefault();
    if (step === 'number') setStep('otp');
    else if (step === 'otp') setStep('pin');
    else if (step === 'pin') {
      setStep('processing');
      setTimeout(onSuccess, 1800);
    }
  };

  return (
    <div className="gw-card">
      <div className="gw-flow-header" style={{ background: '#e2136e' }}>
        <div className="gw-flow-header-title" style={{ fontStyle: 'italic' }}>bKash</div>
        <div style={{ textAlign: 'right', fontSize: '0.7rem' }}>
          <div style={{ opacity: 0.8 }}>Merchant</div>
          <div style={{ fontWeight: 600 }}>Pothik Bondhu</div>
        </div>
      </div>
      <div className="gw-flow-subheader">
        <div><span style={{ color: '#6b7280' }}>Amount: </span><span style={{ fontWeight: 'bold', color: '#e2136e' }}>৳ {amount.toLocaleString()}.00</span></div>
        <div style={{ fontFamily: 'monospace', color: '#9ca3af', fontSize: '0.7rem' }}>Ref: {txnId}</div>
      </div>

      <form onSubmit={next} className="gw-form-body">
        {step === 'number' && (
          <>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Your bKash Account Number</p>
            <input autoFocus required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="01XXXXXXXXX" className="gw-input bkash-focus center mono" />
          </>
        )}
        {step === 'otp' && (
          <>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Enter verification code sent to <br/><b style={{ color: '#111827'}}>{phone}</b></p>
            <input autoFocus required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit" className="gw-input bkash-focus center mono pin" />
          </>
        )}
        {step === 'pin' && (
          <>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Enter your bKash PIN</p>
            <input autoFocus required type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="•••••" className="gw-input bkash-focus center mono pin" />
          </>
        )}
        {step === 'processing' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="gw-spinner" style={{ color: '#e2136e' }} />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>Processing your payment…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="gw-btn-row">
            <button type="button" onClick={onCancel} className="gw-btn gw-btn-cancel">Close</button>
            <button type="submit" className="gw-btn" style={{ background: '#e2136e', color: 'white' }}>{step === 'pin' ? 'Confirm' : 'Proceed'}</button>
          </div>
        )}
      </form>
      <div className="gw-footer" style={{ background: '#fdf2f8' }}>
        Powered by <strong style={{ color: '#e2136e' }}>bKash</strong> · 16247
      </div>
    </div>
  );
}

function NagadFlow({ amount, onSuccess, onCancel }) {
  const [step, setStep] = useState('number');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const txnId = 'NGD' + Math.random().toString().slice(2, 11);

  const next = (e) => {
    e.preventDefault();
    if (step === 'number') setStep('pin');
    else if (step === 'pin') {
      setStep('processing');
      setTimeout(onSuccess, 1800);
    }
  };

  return (
    <div className="gw-card">
      <div className="gw-flow-header" style={{ background: 'linear-gradient(135deg, #ec1c24 0%, #f5841f 100%)' }}>
        <div>
          <div className="gw-flow-header-title">Nagad</div>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>Cashless Future</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.7rem' }}>
          <div style={{ opacity: 0.9 }}>Pay to</div>
          <div style={{ fontWeight: 600 }}>Pothik Bondhu</div>
        </div>
      </div>
      <div className="gw-flow-subheader" style={{ background: '#fff7ed' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ color: '#4b5563' }}>Total: </span>
          <span style={{ fontWeight: 'bold', color: '#ec1c24' }}>৳ {amount.toLocaleString()}.00</span>
        </div>
      </div>

      <form onSubmit={next} className="gw-form-body">
        {step === 'number' && (
          <>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Your Nagad Account Number</label>
            <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '0.375rem', overflow: 'hidden' }} className="nagad-focus-wrapper">
              <span style={{ background: '#f3f4f6', padding: '0.75rem', color: '#6b7280', fontSize: '0.9rem', borderRight: '1px solid #d1d5db' }}>+880</span>
              <input autoFocus required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="1XXXXXXXXX" style={{ flex: 1, border: 'none', padding: '0.75rem', outline: 'none', fontFamily: 'monospace', fontSize: '1rem' }} />
            </div>
          </>
        )}
        {step === 'pin' && (
          <>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Enter your 4-digit Nagad PIN <br/><span style={{ fontSize: '0.7rem', color: '#6b7280' }}>for {phone}</span></p>
            <input autoFocus required type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" className="gw-input nagad-focus center mono pin" />
          </>
        )}
        {step === 'processing' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="gw-spinner" style={{ color: '#ec1c24' }} />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>Confirming payment…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="gw-btn-row">
            <button type="button" onClick={onCancel} className="gw-btn gw-btn-cancel">Cancel</button>
            <button type="submit" className="gw-btn" style={{ background: 'linear-gradient(135deg, #ec1c24, #f5841f)', color: 'white' }}>{step === 'pin' ? 'Pay Now' : 'Next'}</button>
          </div>
        )}
      </form>
      <div className="gw-footer" style={{ background: '#fff7ed' }}>
        Powered by <strong style={{ color: '#ec1c24' }}>Nagad</strong> · Helpline 16167
      </div>
    </div>
  );
}

function RocketFlow({ amount, onSuccess, onCancel }) {
  const [step, setStep] = useState('number');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const next = (e) => {
    e.preventDefault();
    if (step === 'number') setStep('pin');
    else {
      setStep('processing');
      setTimeout(onSuccess, 1800);
    }
  };

  return (
    <div className="gw-card">
      <div className="gw-flow-header" style={{ background: 'linear-gradient(135deg, #8c3494, #5e2470)' }}>
        <div>
          <div className="gw-flow-header-title">Rocket</div>
          <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.9 }}>DBBL Mobile Banking</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.7rem' }}>
          <div style={{ opacity: 0.9 }}>Merchant</div>
          <div style={{ fontWeight: 600 }}>Pothik Bondhu</div>
        </div>
      </div>
      <div className="gw-flow-subheader" style={{ background: '#faf5ff' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ color: '#4b5563' }}>Amount: </span>
          <span style={{ fontWeight: 'bold', color: '#8c3494' }}>৳ {amount.toLocaleString()}.00</span>
        </div>
      </div>

      <form onSubmit={next} className="gw-form-body">
        {step === 'number' && (
          <>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Rocket Account Number</label>
            <input autoFocus required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="01XXXXXXXXX" className="gw-input rocket-focus mono" />
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280' }}>Includes the trailing digit (e.g. 017XXXXXXXX1).</p>
          </>
        )}
        {step === 'pin' && (
          <>
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Enter your 4-digit Rocket PIN</p>
            <input autoFocus required type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" className="gw-input rocket-focus center mono pin" />
          </>
        )}
        {step === 'processing' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="gw-spinner" style={{ color: '#8c3494' }} />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>Authorizing with Rocket…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="gw-btn-row">
            <button type="button" onClick={onCancel} className="gw-btn gw-btn-cancel">Cancel</button>
            <button type="submit" className="gw-btn" style={{ background: '#8c3494', color: 'white' }}>{step === 'pin' ? 'Confirm' : 'Next'}</button>
          </div>
        )}
      </form>
      <div className="gw-footer" style={{ background: '#faf5ff' }}>
        Powered by <strong style={{ color: '#8c3494' }}>Rocket</strong> · DBBL 16216
      </div>
    </div>
  );
}

function formatCard(v) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
function formatExp(v) { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; }

function CardFlow({ amount, onSuccess, onCancel }) {
  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('form');

  const submit = (e) => {
    e.preventDefault();
    if (step === 'form') setStep('otp');
    else if (step === 'otp') {
      setStep('processing');
      setTimeout(onSuccess, 1800);
    }
  };

  return (
    <div className="gw-card">
      <div className="gw-flow-header" style={{ background: '#0a2540' }}>
        <div className="gw-flow-header-title" style={{ fontSize: '1.1rem' }}>Card Payment</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
           <span style={{ background: '#1a1f71', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic', color: 'white' }}>VISA</span>
        </div>
      </div>
      <div className="gw-flow-subheader" style={{ background: '#eff6ff' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ color: '#4b5563' }}>Amount: </span>
          <span style={{ fontWeight: 'bold', color: '#0a2540' }}>৳ {amount.toLocaleString()}.00</span>
        </div>
      </div>
      <form onSubmit={submit} className="gw-form-body">
        {step === 'form' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4b5563', marginBottom: '4px' }}>Card Number</label>
              <input required value={card} onChange={(e) => setCard(formatCard(e.target.value))} inputMode="numeric" placeholder="1234 5678 9012 3456" className="gw-input card-focus mono" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4b5563', marginBottom: '4px' }}>Cardholder Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="As shown on card" className="gw-input card-focus" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4b5563', marginBottom: '4px' }}>Expiry</label>
                <input required value={exp} onChange={(e) => setExp(formatExp(e.target.value))} placeholder="MM/YY" className="gw-input card-focus mono" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#4b5563', marginBottom: '4px' }}>CVC</label>
                <input required type="password" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" className="gw-input card-focus mono" />
              </div>
            </div>
          </>
        )}
        {step === 'otp' && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', background: '#0a2540', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>3DS</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>3D Secure</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b7280' }}>Issued by bank</p>
              </div>
            </div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#374151' }}>OTP sent to mobile ending in <strong style={{ fontFamily: 'monospace' }}>••{card.length > 2 ? card.slice(-2) : 'XX'}</strong>.</p>
            <input autoFocus required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" className="gw-input card-focus center mono pin" />
          </div>
        )}
        {step === 'processing' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="gw-spinner" style={{ color: '#0a2540' }} />
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>Authorizing card…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="gw-btn-row">
            <button type="button" onClick={onCancel} className="gw-btn gw-btn-cancel">Cancel</button>
            <button type="submit" className="gw-btn" style={{ background: '#0a2540', color: 'white' }}>{step === 'otp' ? `Pay ৳ ${amount.toLocaleString()}` : 'Continue'}</button>
          </div>
        )}
      </form>
      <div className="gw-footer">
        🔒 Secured with 256-bit SSL · PCI-DSS compliant
      </div>
    </div>
  );
}