import React from 'react';

const Terms = () => {
  return (
    <div className="legal-page">
      <div className="page-banner">
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before booking your journey.</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Pothik Bondhu. By accessing our website and utilizing our Hajj and Umrah services, you agree to comply with and be bound by the following terms and conditions.</p>
        </section>

        <section>
          <h2>2. Booking & Payments</h2>
          <p>A non-refundable advance payment is required to secure your pre-registration. Full payment must be cleared 45 days prior to the expected departure date. Pothik Bondhu reserves the right to cancel bookings if payment schedules are not met.</p>
        </section>

        <section>
          <h2>3. Visa & Documentation</h2>
          <p>While we facilitate the visa process, the final approval rests solely with the Ministry of Hajj and Umrah, KSA, and the Saudi Embassy. We are not liable for visa rejections due to incomplete documentation or past travel history issues.</p>
        </section>

        <section>
          <h2>4. Cancellations & Refunds</h2>
          <p>Cancellations made 60 days before departure may be eligible for a partial refund, minus administrative and pre-booked hotel/airline fees. No refunds are provided for cancellations within 30 days of departure.</p>
        </section>

        <section>
          <h2>5. Itinerary Changes</h2>
          <p>Flight schedules and hotel allocations are subject to change based on airline operations and Saudi government regulations. We will provide equivalent alternatives if necessary.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;