import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MockGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const { bookingId, amount, clientName } = location.state || {};

  if (!bookingId)
    return <div className="p-12 text-center text-2xl font-bold text-gray-700">Invalid Session</div>;

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
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

const BkashLogo = () => (
  <div className="font-display text-xl font-bold italic tracking-tight">bKash</div>
);
const NagadLogo = () => <div className="font-display text-xl font-bold tracking-tight">Nagad</div>;
const RocketLogo = () => (
  <div className="font-display text-xl font-bold tracking-tight">Rocket</div>
);

const methods = [
  {
    group: 'Mobile Banking',
    items: [
      {
        id: 'bkash',
        name: 'bKash',
        desc: 'Pay with your bKash wallet',
        bg: 'bg-[#e2136e]',
        text: 'text-white',
        logo: <BkashLogo />,
      },
      {
        id: 'nagad',
        name: 'Nagad',
        desc: 'Instant transfer via Nagad',
        bg: 'bg-[#ec1c24]',
        text: 'text-white',
        logo: <NagadLogo />,
      },
      {
        id: 'rocket',
        name: 'Rocket',
        desc: 'Dutch-Bangla Mobile Banking',
        bg: 'bg-[#8c3494]',
        text: 'text-white',
        logo: <RocketLogo />,
      },
    ],
  },
  {
    group: 'Cards',
    items: [
      {
        id: 'card',
        name: 'Credit / Debit Card',
        desc: 'Visa · Mastercard · Amex',
        bg: 'bg-gray-800',
        text: 'text-white',
        logo: (
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-[#1a1f71] px-1.5 py-0.5 text-[10px] font-bold italic text-white">
              VISA
            </span>
            <span className="flex items-center -space-x-1.5">
              <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
              <span className="h-4 w-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
            </span>
          </div>
        ),
      },
    ],
  },
];

function MethodSelect({ onSelect, amount }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-2xl">
      <h2 className="font-display text-lg font-semibold text-gray-900">Select payment method</h2>
      <p className="mt-1 text-sm text-gray-500">
        Pay ৳ {amount.toLocaleString()} using your preferred option.
      </p>

      <div className="mt-6 space-y-6">
        {methods.map((g) => (
          <div key={g.group}>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              {g.group}
            </p>
            <div className="space-y-2.5">
              {g.items.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className="group flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition-all hover:border-blue-500 hover:bg-blue-50"
                >
                  <div
                    className={`grid h-12 w-20 flex-shrink-0 place-items-center rounded-lg ${m.bg} ${m.text}`}
                  >
                    {m.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-gray-400">
        🔒 Your information is encrypted and secure
      </p>
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
      <div className="bg-[#e2136e] px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="font-display text-2xl font-bold italic">bKash</div>
          <div className="text-right text-xs">
            <div className="opacity-80">Merchant</div>
            <div className="font-semibold">Pothik Bondhu</div>
          </div>
        </div>
      </div>
      <div className="bg-[#f9f9f9] px-5 py-3 text-center text-sm border-b border-gray-100">
        <span className="text-gray-600">Amount: </span>
        <span className="font-bold text-[#e2136e]">৳ {amount.toLocaleString()}.00</span>
        <span className="ml-2 text-gray-600">| Invoice: </span>
        <span className="font-mono text-xs">{txnId}</span>
      </div>

      <form onSubmit={next} className="space-y-4 px-6 py-7">
        {step === 'number' && (
          <>
            <p className="text-center text-sm text-gray-600">Your bKash Account Number</p>
            <input
              autoFocus
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-lg font-mono tracking-wider outline-none focus:border-[#e2136e] focus:ring-2 focus:ring-[#e2136e]/20"
            />
            <p className="text-center text-xs text-gray-500">
              By clicking Confirm, you are agreeing to the{' '}
              <span className="text-[#e2136e]">terms & conditions</span>
            </p>
          </>
        )}
        {step === 'otp' && (
          <>
            <p className="text-center text-sm text-gray-600">
              Enter the verification code sent to
              <br />
              <span className="font-semibold text-gray-900">{phone}</span>
            </p>
            <input
              autoFocus
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-[#e2136e] focus:ring-2 focus:ring-[#e2136e]/20"
            />
            <p className="text-center text-xs text-gray-500">
              Didn't receive? <span className="text-[#e2136e]">Resend</span>
            </p>
          </>
        )}
        {step === 'pin' && (
          <>
            <p className="text-center text-sm text-gray-600">Enter your bKash PIN</p>
            <input
              autoFocus
              required
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="• • • • •"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-[#e2136e] focus:ring-2 focus:ring-[#e2136e]/20"
            />
          </>
        )}
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#e2136e]/20 border-t-[#e2136e]" />
            <p className="mt-4 text-sm text-gray-600">Processing your payment…</p>
            <p className="mt-1 text-xs text-gray-400">Do not close this window</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#e2136e] px-4 py-3 text-sm font-bold text-white hover:bg-[#c11160]"
            >
              {step === 'pin' ? 'Confirm' : 'Proceed'}
            </button>
          </div>
        )}
      </form>
      <div className="border-t border-gray-200 bg-[#f9f9f9] px-5 py-3 text-center text-[10px] text-gray-500">
        Powered by <span className="font-semibold text-[#e2136e]">bKash</span> · 16247
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
      <div
        className="px-5 py-5 text-white"
        style={{ background: 'linear-gradient(135deg, #ec1c24 0%, #f5841f 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl font-bold">Nagad</div>
            <div className="text-[10px] uppercase tracking-widest opacity-90">Cashless Future</div>
          </div>
          <div className="text-right text-xs">
            <div className="opacity-90">Pay to</div>
            <div className="font-semibold">Pothik Bondhu</div>
          </div>
        </div>
      </div>
      <div className="bg-orange-50 px-5 py-3 text-center text-sm border-b border-orange-100">
        <span className="text-gray-700">Total: </span>
        <span className="font-bold text-[#ec1c24]">৳ {amount.toLocaleString()}.00</span>
      </div>
      <form onSubmit={next} className="space-y-4 px-6 py-7">
        {step === 'number' && (
          <>
            <label className="block text-sm font-medium text-gray-700">
              Your Nagad Account Number
            </label>
            <div className="flex items-center overflow-hidden rounded-md border border-gray-300 focus-within:border-[#ec1c24] focus-within:ring-2 focus-within:ring-[#ec1c24]/20">
              <span className="bg-gray-100 px-3 py-3 text-sm text-gray-500">+880</span>
              <input
                autoFocus
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="1XXXXXXXXX"
                className="flex-1 px-3 py-3 font-mono outline-none"
              />
            </div>
            <p className="text-xs text-gray-500">
              By proceeding, you accept Nagad's{' '}
              <span className="text-[#ec1c24]">terms of service</span>.
            </p>
          </>
        )}
        {step === 'pin' && (
          <>
            <p className="text-center text-sm text-gray-700">
              Enter your 4-digit Nagad PIN
              <br />
              <span className="text-xs text-gray-500">for {phone}</span>
            </p>
            <input
              autoFocus
              required
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-[#ec1c24] focus:ring-2 focus:ring-[#ec1c24]/20"
            />
            <p className="text-center font-mono text-[10px] text-gray-400">Txn: {txnId}</p>
          </>
        )}
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#ec1c24]/20 border-t-[#ec1c24]" />
            <p className="mt-4 text-sm text-gray-600">Confirming payment with Nagad…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ec1c24, #f5841f)' }}
            >
              {step === 'pin' ? 'Pay Now' : 'Next'}
            </button>
          </div>
        )}
      </form>
      <div className="border-t border-gray-200 bg-orange-50/50 px-5 py-3 text-center text-[10px] text-gray-500">
        Powered by <span className="font-semibold text-[#ec1c24]">Nagad</span> · Helpline 16167
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
      <div
        className="px-5 py-5 text-white"
        style={{ background: 'linear-gradient(135deg, #8c3494, #5e2470)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl font-bold">Rocket</div>
            <div className="text-[10px] uppercase tracking-widest opacity-90">
              Dutch-Bangla Mobile Banking
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="opacity-90">Merchant</div>
            <div className="font-semibold">Pothik Bondhu</div>
          </div>
        </div>
      </div>
      <div className="bg-purple-50 px-5 py-3 text-center text-sm border-b border-purple-100">
        <span className="text-gray-700">Amount: </span>
        <span className="font-bold text-[#8c3494]">৳ {amount.toLocaleString()}.00</span>
      </div>
      <form onSubmit={next} className="space-y-4 px-6 py-7">
        {step === 'number' && (
          <>
            <label className="block text-sm font-medium text-gray-700">Rocket Account Number</label>
            <input
              autoFocus
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-md border border-gray-300 px-4 py-3 font-mono outline-none focus:border-[#8c3494] focus:ring-2 focus:ring-[#8c3494]/20"
            />
            <p className="text-xs text-gray-500">
              Includes the trailing checksum digit (e.g. 017XXXXXXXX1).
            </p>
          </>
        )}
        {step === 'pin' && (
          <>
            <p className="text-center text-sm text-gray-700">Enter your 4-digit Rocket PIN</p>
            <input
              autoFocus
              required
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-[#8c3494] focus:ring-2 focus:ring-[#8c3494]/20"
            />
          </>
        )}
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#8c3494]/20 border-t-[#8c3494]" />
            <p className="mt-4 text-sm text-gray-600">Authorizing with Rocket…</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#8c3494] px-4 py-3 text-sm font-bold text-white hover:bg-[#7a2d82]"
            >
              {step === 'pin' ? 'Confirm' : 'Next'}
            </button>
          </div>
        )}
      </form>
      <div className="border-t border-gray-200 bg-purple-50/40 px-5 py-3 text-center text-[10px] text-gray-500">
        Powered by <span className="font-semibold text-[#8c3494]">Rocket</span> · DBBL 16216
      </div>
    </div>
  );
}

function formatCard(v) {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExp(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function CardFlow({ amount, onSuccess, onCancel }) {
  const [type, setType] = useState('credit');
  const [card, setCard] = useState('4242 4242 4242 4242');
  const [exp, setExp] = useState('12/28');
  const [cvc, setCvc] = useState('123');
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl">
      <div className="bg-[#0a2540] px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="font-display text-lg font-semibold">Card Payment</div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#1a1f71] px-2 py-1 text-[10px] font-bold italic">
              VISA
            </span>
            <span className="flex items-center -space-x-1.5">
              <span className="h-5 w-5 rounded-full bg-[#eb001b]" />
              <span className="h-5 w-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
            </span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 px-5 py-3 text-center text-sm border-b border-blue-100">
        <span className="text-gray-700">Amount: </span>
        <span className="font-bold text-[#0a2540]">৳ {amount.toLocaleString()}.00</span>
      </div>
      <form onSubmit={submit} className="space-y-4 px-6 py-6">
        {step === 'form' && (
          <>
            <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
              {['credit', 'debit'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize ${type === t ? 'bg-white text-[#0a2540] shadow-sm' : 'text-gray-500'}`}
                >
                  {t} card
                </button>
              ))}
            </div>
            <Field label="Card Number">
              <input
                required
                value={card}
                onChange={(e) => setCard(formatCard(e.target.value))}
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono outline-none focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
              />
            </Field>
            <Field label="Cardholder Name">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As shown on card"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry">
                <input
                  required
                  value={exp}
                  onChange={(e) => setExp(formatExp(e.target.value))}
                  placeholder="MM/YY"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono outline-none focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
                />
              </Field>
              <Field label="CVC">
                <input
                  required
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 font-mono outline-none focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
                />
              </Field>
            </div>
          </>
        )}
        {step === 'otp' && (
          <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded bg-[#0a2540] text-xs font-bold text-white">
                3DS
              </div>
              <div>
                <p className="text-sm font-semibold">3D Secure Verification</p>
                <p className="text-xs text-gray-500">Issued by your bank</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              An OTP has been sent to your registered mobile number ending in{' '}
              <span className="font-mono font-bold">••{card.slice(-2)}</span>.
            </p>
            <input
              autoFocus
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="mt-3 w-full rounded-md border border-gray-300 px-4 py-3 text-center text-xl font-mono tracking-[0.4em] outline-none focus:border-[#0a2540] focus:ring-2 focus:ring-[#0a2540]/20"
            />
          </div>
        )}
        {step === 'processing' && (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0a2540]/20 border-t-[#0a2540]" />
            <p className="mt-4 text-sm text-gray-600">Authorizing your card…</p>
            <p className="mt-1 text-xs text-gray-400">Please do not refresh</p>
          </div>
        )}
        {step !== 'processing' && (
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-[#0a2540] px-4 py-3 text-sm font-bold text-white hover:bg-[#0e2f50]"
            >
              {step === 'otp' ? `Pay ৳ ${amount.toLocaleString()}` : 'Continue'}
            </button>
          </div>
        )}
      </form>
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 text-center text-[10px] text-gray-500">
        🔒 Secured with 256-bit SSL · PCI-DSS compliant
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}
