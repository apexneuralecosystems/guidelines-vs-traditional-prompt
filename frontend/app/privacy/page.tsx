import Link from 'next/link';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Privacy Policy</h1>
        <p className="page-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      <div className="legal-content">
        <section>
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how we collect, use, and protect your personal information
            when you use our Life Insurance Comparison Demo application. We are committed to protecting
            your privacy and ensuring the security of your personal data.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>
            When you use our application, you may provide us with information including:
          </p>
          <ul>
            <li>Queries and questions you submit through the demo interface</li>
            <li>Any personal information you choose to include in your queries</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>
            We may automatically collect certain information about your device and usage patterns,
            including:
          </p>
          <ul>
            <li>IP address and browser type</li>
            <li>Usage statistics and interaction data</li>
            <li>Error logs and performance metrics</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process your queries and generate responses</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Ensure the security and integrity of our application</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. However,
            no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>
            Our application uses third-party AI services (OpenRouter) to process queries. These
            services may have their own privacy policies governing the use of your information.
            We encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to fulfill the purposes outlined
            in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to object to processing of your data</li>
            <li>Right to data portability</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies to enhance your experience. You can
            control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our application is not intended for children under the age of 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through the
            appropriate channels provided in our application.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

