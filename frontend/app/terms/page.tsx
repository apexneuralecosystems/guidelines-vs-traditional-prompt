import Link from 'next/link';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Terms and Conditions</h1>
        <p className="page-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="legal-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this Life Insurance Comparison Demo application, you accept and
            agree to be bound by the terms and provision of this agreement. If you do not agree to
            abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily use this application for demonstration and
            educational purposes. This is the grant of a license, not a transfer of title, and
            under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software contained in the application</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>
            The materials and information provided in this application are for demonstration purposes
            only. The information is provided on an &quot;as is&quot; basis. We make no warranties,
            expressed or implied, and hereby disclaim and negate all other warranties including,
            without limitation, implied warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            <strong>Important:</strong> This application is a demonstration tool and should not be
            used as a substitute for professional financial or insurance advice. Always consult with
            qualified professionals for actual life insurance decisions.
          </p>
        </section>

        <section>
          <h2>4. Limitations</h2>
          <p>
            In no event shall we or our suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising
            out of the use or inability to use the materials on this application, even if we or an
            authorized representative has been notified orally or in writing of the possibility of
            such damage.
          </p>
        </section>

        <section>
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing in this application could include technical, typographical, or
            photographic errors. We do not warrant that any of the materials on its application are
            accurate, complete, or current. We may make changes to the materials contained in this
            application at any time without notice.
          </p>
        </section>

        <section>
          <h2>6. Links</h2>
          <p>
            We have not reviewed all of the sites linked to our application and are not responsible
            for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by us of the site. Use of any such linked website is at the user&apos;s own risk.
          </p>
        </section>

        <section>
          <h2>7. Modifications</h2>
          <p>
            We may revise these terms of service for its application at any time without notice. By
            using this application you are agreeing to be bound by the then current version of these
            terms of service.
          </p>
        </section>

        <section>
          <h2>8. User Conduct</h2>
          <p>You agree not to use the application to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Transmit any harmful, offensive, or inappropriate content</li>
            <li>Interfere with or disrupt the application or servers</li>
            <li>Attempt to gain unauthorized access to any portion of the application</li>
          </ul>
        </section>

        <section>
          <h2>9. Intellectual Property</h2>
          <p>
            All content, features, and functionality of this application, including but not limited
            to text, graphics, logos, and software, are the property of the application owners and
            are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our application immediately,
            without prior notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with applicable
            laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that
            location.
          </p>
        </section>

        <section>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us through
            the appropriate channels provided in our application.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

